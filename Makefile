# CAP-71 + CAP-83 pre-release: pin to the protocol-27 .x and resolve feature
# gates via `stellar-xdr xfile preprocess` (rs-stellar-xdr #503) before xdrgen,
# since the Ruby xdrgen used here does not understand #ifdef.
XDR_BASE_URL_CURR=https://github.com/stellar/stellar-xdr/raw/5187e69f568dc13ccb5ddc74f81ffd4aaba4fea1
XDR_BASE_LOCAL_CURR=xdr/curr
XDR_FEATURES=CAP_0071,CAP_0083
XDR_FILES_CURR= \
	Stellar-SCP.x \
	Stellar-ledger-entries.x \
	Stellar-ledger.x \
	Stellar-overlay.x \
	Stellar-transaction.x \
	Stellar-types.x \
	Stellar-contract.x \
	Stellar-contract-env-meta.x \
	Stellar-contract-meta.x \
	Stellar-contract-spec.x \
	Stellar-contract-config-setting.x \
	Stellar-exporter.x
XDR_FILES_LOCAL_CURR=$(addprefix xdr/curr/,$(XDR_FILES_CURR))

XDR_BASE_URL_NEXT=https://github.com/stellar/stellar-xdr/raw/5187e69f568dc13ccb5ddc74f81ffd4aaba4fea1
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
	Stellar-contract-meta.x \
	Stellar-contract-spec.x \
	Stellar-contract-config-setting.x \
	Stellar-exporter.x
XDR_FILES_LOCAL_NEXT=$(addprefix xdr/next/,$(XDR_FILES_NEXT))

XDRGEN_COMMIT=master
DTSXDR_COMMIT=master

all: generate

generate: src/generated/curr_generated.js types/curr.d.ts src/generated/next_generated.js types/next.d.ts

src/generated/curr_generated.js: $(XDR_FILES_LOCAL_CURR)
	mkdir -p $(dir $@)
	> $@
	docker run --rm -v $$PWD:/wd -w /wd ruby:3.1 /bin/bash -c '\
		gem install specific_install -v 0.3.8 && \
		gem specific_install https://github.com/stellar/xdrgen.git -b $(XDRGEN_COMMIT) && \
		xdrgen --language javascript --namespace curr --output src/generated $^ \
		'

src/generated/next_generated.js: $(XDR_FILES_LOCAL_NEXT)
	mkdir -p $(dir $@)
	> $@
	docker run --rm -v $$PWD:/wd -w /wd ruby:3.1 /bin/bash -c '\
		gem install specific_install -v 0.3.8 && \
		gem specific_install https://github.com/stellar/xdrgen.git -b $(XDRGEN_COMMIT) && \
		xdrgen --language javascript --namespace next --output src/generated $^ \
		'

types/curr.d.ts: src/generated/curr_generated.js
	docker run --rm -v $$PWD:/wd -w / --entrypoint /bin/sh node:lts-alpine -c '\
		apk add --update git && apk add --update yarn && \
		git clone --depth 1 https://github.com/stellar/dts-xdr -b $(DTSXDR_COMMIT) --single-branch && \
		cd /dts-xdr && \
		yarn install --network-concurrency 1 && \
		OUT=/wd/$@ npx jscodeshift -t src/transform.js /wd/$< && \
		cd /wd && \
		yarn run prettier --write /wd/$@ \
		'

types/next.d.ts: src/generated/next_generated.js
	docker run --rm -v $$PWD:/wd -w / --entrypoint /bin/sh node:lts-alpine -c '\
		apk add --update git && apk add --update yarn && \
		git clone --depth 1 https://github.com/stellar/dts-xdr -b $(DTSXDR_COMMIT) --single-branch && \
		cd /dts-xdr && \
		yarn install --network-concurrency 1 && \
		OUT=/wd/$@ npx jscodeshift -t src/transform.js /wd/$< && \
		cd /wd && \
		yarn run prettier --write /wd/$@ \
		'

clean:
	rm -f src/generated/*

$(XDR_FILES_LOCAL_CURR):
	mkdir -p $(dir $@)
	curl -L -o $@ $(XDR_BASE_URL_CURR)/$(notdir $@)
	stellar-xdr xfile preprocess --features "$(XDR_FEATURES)" $@ > $@.pp && mv -f $@.pp $@

$(XDR_FILES_LOCAL_NEXT):
	mkdir -p $(dir $@)
	curl -L -o $@ $(XDR_BASE_URL_NEXT)/$(notdir $@)
	stellar-xdr xfile preprocess --features "$(XDR_FEATURES)" $@ > $@.pp && mv -f $@.pp $@

reset-xdr:
	rm -f xdr/*/*.x
	rm -f src/generated/*.js
	rm -f types/curr.d.ts
	rm -f types/next.d.ts
	$(MAKE) generate
