# Lerna Monorepo CDK example

## FIRST THINGS FIRST

1. install lerna globally
2. install cdk globally

## PROJECT STRUCTURE

-   packages/cdk-app contains normal cdk package which depends on our lambda packages
-   packages/lambda-a is a normal typescript lambda
-   packages/lambda-b is a normal typescript lambda
-   packages/common-lambda-lib is a common nodejs package used in both lambdas

## TYPESCRIPT CONFIGURATION

there are 3 tsconfig files in the root of the project.

-   tsconfig.build.json - this is our base tsconfig file that all nested packages extend so we dont have to duplicate all the configs in this one. This tsconfig is used / called whenever we run `yarn run build`
-   tsconfig.json - this extends the above tsconfig. We have one for the entire project and this is configured to give us nice intellisense in VSCODE
-   tsconfig.test.json - this config is used by jest in our jest testing environment

## WEBPACK CONFIGURATION

-   we use webpack to build of our lambdas (not common libraries used in the lambdas, these are built using typescript compiler only)
-   we have a root webpack.config.build.json which all common lambdas extend so we dont have to repeat ourselves.
-   in the root webpack.config, when we build our lambda code, we have to rename the package name of the compiled lambdas in the cdk.out directory and dist folder. This is to avoid naming conflicts when we use lambda as no 2 packages can have the same name.

## Lambda CONFIGURATION

-   lambdas use webpack to be built

## COMMON LIBRARY CONFIGURATION

-   common library uses typescript compiler to be built

## MONOREPO CONFIGURATION

-   we use yarn workspaces. you cant use NPM on this project unless you reconfigure lerna and update the package.json to do so
-   all node packages go in /packages directory

## JEST CONFIGURATION

-   we use jest for testing
-   see jest.config.js
-   we need to use ts-jest so that type script plays nicely / gets compiled in our testing environment
-   we configure our tsconfig.build to ignore our test files when we build all of our lambdas to reduce package size and allows us to keep our testing files next to our development files which I like to do to quickly see project coverage.
-   run `yarn run test` or `yarn run test:watch` in root project

## RUNNING CDK COMMANDS

-   to run any cdk commands, you need to first run `cd packages/cdk-app` and run the commands as per usual from there
-   before deploying or synthesizing your final cdk project, you need to build all of your lambdas and other packages. As a convenience method to do this, all packages have a build command in their package.json. You can run `lerna run build` once from the command line to build all these packages, then run `cdk synth` or `cdk deploy` as per usual

## GETTING STARTED

1. clone repo
2. run `yarn install` in project root to install all node dependencies for both root and nested project
3. run `lerna run build` to build all typescript code
4. run `cd packages/cdk-app`
5. run `cdk deploy` to deploy or cdk bootstrap or whatever cdk command you like.

## Development cycle

run `yarn run start` to start a local lambda server
see utils folder for how to add / remove lambdas from the server
read https://steveholgado.com/aws-lambda-local-development/ for more information

## Adding a lambda to cdk

1. create your new lambda in packages directory
2. run `lerna add {new lambda package name} --scope @simonverhoeven/cdk-app` this will add the new lambda to your cdk project. This isnt required but it make referencing the lambda folder directory easier in the following step
3. add your lambda to your cdk stack as per usual, the important part to change is where to reference the lambda code:

```
new lambda.Function(this, 'lambda-a', {
	functionName: 'lambda-a',
	memorySize: 256,
	runtime: lambda.Runtime.NODEJS_12_X,
	handler: 'index.handler',
	code: lambda.Code.fromAsset(
		path.join(
			require.resolve('@simonverhoeven/lambda-a'),
			'..'
		)
	),

})
```

## FIRST DEPLOY

1. yarn install
2. lerna run build
3. cd packages/cdk-app
4. cdk bootstrap
5. cdk deploy

## Useful commands

`lerna run build --scope @simonverhoeven/lambda-a` can run this anywhere inside of project to build only one lambda, useful if only building and deploying an update to one lambda so that you dont have to build all other lambdas before dpeloy as project grows

`lerna add @simonverhoeven/common-lambda-lib --scope @simonverhoeven/lambda-a` - if you need to ever add one of your local packages (common-lambda-lib) to another local package (lambda-a), this will do the trick and update lambda-a's package.json to add the dependency

## Gotcha's

-   its important to always reference the /dist/ directory when importing files from common libraries...
-   if you make an edit to your common lambda library, you will have to rebuild all the packages that use this dependency... best to run `lerna run build` in this use case
-   sometimes the typescript compiler caches builds which can lead to unexpected results, especially if you change your tsconfig. To remedy this, run `lerna run clean:light` to delete the cache file and then `lerna run build` to rebuild
-   when adding devDependencies to the project, in most cases you will want to add them to the root project instead of the newsted packages... read up on lerna about this, specifically dev dependencies that have command line binaries
