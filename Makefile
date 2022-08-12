XDR_BASE_URL_CURR=https://github.com/stellar/stellar-core/raw/master/src/protocol-curr/xdr
XDR_BASE_LOCAL_CURR=xdr/curr
XDR_FILES_CURR= \
	Stellar-SCP.x \
	Stellar-ledger-entries.x \
	Stellar-ledger.x \
	Stellar-overlay.x \
	Stellar-transaction.x \
	Stellar-types.x
XDR_FILES_LOCAL_CURR=$(addprefix xdr/curr/,$(XDR_FILES_CURR))

XDR_BASE_URL_NEXT=https://github.com/stellar/stellar-xdr-next/raw/main
XDR_BASE_LOCAL_NEXT=xdr/next
XDR_FILES_NEXT= \
	Stellar-SCP.x \
	Stellar-ledger-entries.x \
	Stellar-ledger.x \
	Stellar-overlay.x \
	Stellar-transaction.x \
	Stellar-types.x \
	Stellar-contract.x \
	Stellar-contract-env-meta.x \
	Stellar-contract-spec.x
XDR_FILES_LOCAL_NEXT=$(addprefix xdr/next/,$(XDR_FILES_NEXT))

XDRGEN_COMMIT=master
DTSXDR_COMMIT=master

all: generate

generate: src/generated/curr_generated.js types/curr.d.ts src/generated/next_generated.js types/next.d.ts

src/generated/curr_generated.js: $(XDR_FILES_LOCAL_CURR)
	mkdir -p $(dir $@)
	> $@
	docker run -it --rm -v $$PWD:/wd -w /wd ruby /bin/bash -c '\
		gem install specific_install -v 0.3.7 && \
		gem specific_install https://github.com/stellar/xdrgen.git -b $(XDRGEN_COMMIT) && \
		xdrgen --language javascript --namespace curr --output src/generated $^ \
		'

src/generated/next_generated.js: $(XDR_FILES_LOCAL_NEXT)
	mkdir -p $(dir $@)
	> $@
	docker run -it --rm -v $$PWD:/wd -w /wd ruby /bin/bash -c '\
		gem install specific_install -v 0.3.7 && \
		gem specific_install https://github.com/stellar/xdrgen.git -b $(XDRGEN_COMMIT) && \
		xdrgen --language javascript --namespace next --output src/generated $^ \
		'

types/curr.d.ts: src/generated/curr_generated.js
	docker run -it --rm -v $$PWD:/wd -w / --entrypoint /bin/sh node:alpine -c '\
		apk add --update git && \
		git clone --depth 1 https://github.com/stellar/dts-xdr -b $(DTSXDR_COMMIT) --single-branch && \
		cd /dts-xdr && \
		yarn install && \
		OUT=/wd/types/curr.d.ts npx jscodeshift -t src/transform.js /wd/src/generated/curr_generated.js && \
		cd /wd && \
		yarn run prettier --write /wd/types/xdr.d.ts \
		'

types/next.d.ts: src/generated/next_generated.js
	docker run -it --rm -v $$PWD:/wd -w / --entrypoint /bin/sh node:alpine -c '\
		apk add --update git && \
		git clone --depth 1 https://github.com/stellar/dts-xdr -b $(DTSXDR_COMMIT) --single-branch && \
		cd /dts-xdr && \
		yarn install && \
		OUT=/wd/types/next.d.ts npx jscodeshift -t src/transform.js /wd/src/generated/next_generated.js && \
		cd /wd && \
		yarn run prettier --write /wd/types/xdr.d.ts \
		'

clean:
	rm -f src/generated/*

$(XDR_FILES_LOCAL_CURR):
	mkdir -p $(dir $@)
	curl -L -o $@ $(XDR_BASE_URL_CURR)/$(notdir $@)

$(XDR_FILES_LOCAL_NEXT):
	mkdir -p $(dir $@)
	curl -L -o $@ $(XDR_BASE_URL_NEXT)/$(notdir $@)

reset-xdr:
	rm -f xdr/*/*.x
	rm -f types/curr.d.ts
	rm -f types/next.d.ts
	$(MAKE) generate
