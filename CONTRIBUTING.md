# How to contribute

Please read the [Contribution Guide](https://github.com/stellar/docs/blob/master/CONTRIBUTING.md).

Then please [sign the Contributor License Agreement](https://docs.google.com/forms/d/1g7EF6PERciwn7zfmfke5Sir2n10yddGGSXyZsq98tVY/viewform?usp=send_form).



# Releasing
SDK maintainers should follow [semantic versioning](https://semver.org/) best practices for releasing the SDK.

Use your best judgement when deciding on when to craft a release: maybe enough changes have accumulated to warrant a release, maybe there's a high-urgency fix that needs to be published immediately, or maybe you can put it off for a particular feature. It's all dependent on what else is going on.

As you probably already know, there are two main components to the JavaScript SDK environment: the `stellar-base` package (this repo) and the higher-level `stellar-sdk` package (from [here](https://github.com/stellar/js-stellar-sdk)) that relies on this one as a dependency. Care should be taken when updating either, as there are quite a few small steps that can get overlooked.

### Updating Base
Once all of the PRs for a particular release are in, it's time to actually publish & deploy a new version.

 - [ ] Create a new branch with the new version, e.g. `git switch -C v1.0.0`

 - [ ] First, look at the diff between the latest release and master: e.g. https://github.com/stellar/js-stellar-base/compare/v5.1.0...master. Replace `v5.1.0` here with the [latest release](https://github.com/stellar/js-stellar-base/releases/latest).

 - [ ] Ensure that all of the PRs in this delta are accurately reflected in the [CHANGELOG](./CHANGELOG.md), broken down by impact and linking to the corresponding PRs. Update the file if necessary.

 - [ ] Run `yarn preversion` to build and test an optimized bundle and ensure Typescript compatibility (one of the most common sources of bugs, since this library is written purely in JS but must be usable from TS).

 - [ ] Run `yarn version` to update the version number in the package.json (or modify the `"version"` field manually).

 - [ ] Commit & push your branch, then [create a PR](https://github.com/stellar/js-stellar-base/compare).

 - [ ] Once approved, merge it and then [create a new release](https://github.com/stellar/js-stellar-base/releases/new), using the same version as you did for the branch; **let GitHub create the tag for you**. In the description for the release, paste in the relevant parts of the [CHANGELOG](./CHANGELOG.md).

 - [ ] Once the release has been created and the build succeeds, the new version should be deployed to `npm` and accessible to all. You can watch this yourself, either via the [`npm` page](https://www.npmjs.com/package/stellar-base) or from the command line:

```bash
watch 'curl -s "https://registry.npmjs.org/stellar-base" | jq ".versions | keys | last"'
```

### Updating SDK
Refer to the SDK's [contributing guide](https://github.com/stellar/js-stellar-sdk/blob/master/CONTRIBUTING.md#Releasing) for any additional steps required there.
