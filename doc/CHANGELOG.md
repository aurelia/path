<a name="1.1.2"></a>
## [1.1.2](https://github.com/aurelia/path/compare/1.1.1...1.1.2) (2019-01-18)

* Add module field to package.json.

<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/path/compare/1.1.0...v1.1.1) (2016-09-23)


### Bug Fixes

* **index:** ensure new traditional param is marked as optional ([fc600e5](https://github.com/aurelia/path/commit/fc600e5))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/path/compare/1.0.0...v1.1.0) (2016-09-22)

#### Features

* **queries:** Build and parse queries also in traditional style

<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/path/compare/1.0.0-rc.1.0.0...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/path/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.2 (2016-05-10)


### 1.0.0-beta.1.2.1 (2016-04-06)

* Fix for query string return true for param with equal sign on the end
* Added Unit tests for Fix for query string return true for param with equal sign on the end

### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.1 (2016-03-01)


### 1.0.0-beta.1.1.0 (2016-01-28)


### 1.0.0-beta.1 (2015-11-16)


## 0.11.0 (2015-11-09)


## 0.10.0 (2015-10-13)


#### Bug Fixes

* **Path:** declare trailingSlash ([3b772ff6](http://github.com/aurelia/path/commit/3b772ff6efd01f0b84c208753effa7df06862c8f))
* **all:**
  * update compiler ([191125de](http://github.com/aurelia/path/commit/191125de9da5ae4cf122068429c65ade7237454c))
  * rename buildParams to buildQueryString ([e6d9ed33](http://github.com/aurelia/path/commit/e6d9ed334e2a3ad096c740996855213fee2c225d))
* **build:**
  * update linting, testing and tools ([557f223f](http://github.com/aurelia/path/commit/557f223f4bb9db1969023ae64fb4a9e8d752231d))
  * add missing bower bump ([869ab8dd](http://github.com/aurelia/path/commit/869ab8ddac6aa73ca3006b0a03572bc32228f961))
* **join:**
  * respect file protocol with empty host ([d51d32b7](http://github.com/aurelia/path/commit/d51d32b73c979430bdcc7501fe56cda29f79c278))
  * add compiled js ([46620452](http://github.com/aurelia/path/commit/4662045269ee3e764efb2afc7e48b7ac68ca68e3))
  * keep trailing slash ([3e7ed200](http://github.com/aurelia/path/commit/3e7ed2005bf90d007e1742f9ff78965a99547623))
  * numerous bug fixes to the join algorithm ([0114d322](http://github.com/aurelia/path/commit/0114d322287e935c4e2731b9281890e3b31b5442))
* **package:**
  * update aurelia tools and dts generator ([379e53e0](http://github.com/aurelia/path/commit/379e53e071c3691e6fb8d289ff31cba998938d76))
  * change jspm directories ([a12623eb](http://github.com/aurelia/path/commit/a12623eb901ca130d1fcf1241976712a3d459570))
* **path:**
  * Join protocol independent paths ([34655ae4](http://github.com/aurelia/path/commit/34655ae41d7d3495a84be25fce8866373e196c37))
  * joining an absolute path fragment with another incorrectly removes the first sla ([4111cfef](http://github.com/aurelia/path/commit/4111cfef9d00e4b6fbd2d04241d0e7c48526387c))


#### Features

* **all:** add buildParams for building querystrings. ([52b22de6](http://github.com/aurelia/path/commit/52b22de6747043742d5096be952780ab58732020))
* **build:** update compiler and switch to register module format ([470daf2e](http://github.com/aurelia/path/commit/470daf2ee2781aa5ad2f24af3cfcc471a2593b43))
* **docs:** generate api.json from .d.ts file ([9362b808](http://github.com/aurelia/path/commit/9362b8086e73d06180e7d11c1f5c0e57e38485db))
* **join:** add a utility for joining paths ([9342f179](http://github.com/aurelia/path/commit/9342f179e548847f6c27d7e8a5b7fbb275f9c5b2))
* **query-strings:** move query string helpers from route-recognizer so they can be reused ([adccb98d](http://github.com/aurelia/path/commit/adccb98d3fe54ed562bb07589a932b939230a12a))


## 0.9.0 (2015-09-04)


#### Bug Fixes

* **build:** update linting, testing and tools ([557f223f](http://github.com/aurelia/path/commit/557f223f4bb9db1969023ae64fb4a9e8d752231d))
* **join:** respect file protocol with empty host ([d51d32b7](http://github.com/aurelia/path/commit/d51d32b73c979430bdcc7501fe56cda29f79c278))


#### Features

* **docs:** generate api.json from .d.ts file ([9362b808](http://github.com/aurelia/path/commit/9362b8086e73d06180e7d11c1f5c0e57e38485db))
* **query-strings:** move query string helpers from route-recognizer so they can be reused ([adccb98d](http://github.com/aurelia/path/commit/adccb98d3fe54ed562bb07589a932b939230a12a))


### 0.8.1 (2015-07-29)

* improve output file name

## 0.8.0 (2015-07-01)


#### Bug Fixes

* **package:** update aurelia tools and dts generator ([379e53e0](http://github.com/aurelia/path/commit/379e53e071c3691e6fb8d289ff31cba998938d76))


## 0.7.0 (2015-06-08)


### 0.6.1 (2015-05-06)


#### Bug Fixes

* **Path:** declare trailingSlash ([3b772ff6](http://github.com/aurelia/path/commit/3b772ff6efd01f0b84c208753effa7df06862c8f))


## 0.6.0 (2015-04-30)


#### Bug Fixes

* **join:**
  * add compiled js ([46620452](http://github.com/aurelia/path/commit/4662045269ee3e764efb2afc7e48b7ac68ca68e3))
  * keep trailing slash ([3e7ed200](http://github.com/aurelia/path/commit/3e7ed2005bf90d007e1742f9ff78965a99547623))


## 0.5.0 (2015-04-09)


#### Bug Fixes

* **all:** update compiler ([191125de](http://github.com/aurelia/path/commit/191125de9da5ae4cf122068429c65ade7237454c))


### 0.4.6 (2015-03-24)


#### Bug Fixes

* **path:** Join protocol independent paths ([34655ae4](http://github.com/aurelia/path/commit/34655ae41d7d3495a84be25fce8866373e196c37))


### 0.4.5 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([a12623eb](http://github.com/aurelia/path/commit/a12623eb901ca130d1fcf1241976712a3d459570))


### 0.4.4 (2015-02-27)

* Update compiler.

### 0.4.3 (2015-02-11)


#### Bug Fixes

* **all:** rename buildParams to buildQueryString ([e6d9ed33](http://github.com/aurelia/path/commit/e6d9ed334e2a3ad096c740996855213fee2c225d))
* **build:** add missing bower bump ([869ab8dd](http://github.com/aurelia/path/commit/869ab8ddac6aa73ca3006b0a03572bc32228f961))


#### Features

* **all:** add buildParams for building querystrings. ([52b22de6](http://github.com/aurelia/path/commit/52b22de6747043742d5096be952780ab58732020))


### 0.4.2 (2015-01-30)


#### Bug Fixes

* **path:** joining an absolute path fragment with another incorrectly removes the first sla ([4111cfef](http://github.com/aurelia/path/commit/4111cfef9d00e4b6fbd2d04241d0e7c48526387c))


### 0.4.1 (2015-01-22)

* Update compiler.

## 0.4.0 (2015-01-06)


#### Features

* **build:** update compiler and switch to register module format ([470daf2e](http://github.com/aurelia/path/commit/470daf2ee2781aa5ad2f24af3cfcc471a2593b43))


## 0.3.0 (2014-12-18)


#### Bug Fixes

* **join:** numerous bug fixes to the join algorithm ([0114d322](http://github.com/aurelia/path/commit/0114d322287e935c4e2731b9281890e3b31b5442))


## 0.2.0 (2014-12-16)


#### Features

* **join:** add a utility for joining paths ([9342f179](http://github.com/aurelia/path/commit/9342f179e548847f6c27d7e8a5b7fbb275f9c5b2))
