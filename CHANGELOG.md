## [Unreleased]
- Support builtin keyword syntax highlight
- Support robot list variable and dict variable analyze
- Support linux system

## 0.2.7 - 2017-06-02
### Added
- Support variable scope analyze, what means that if a variable is defined dynamic, and goto variable definition will return that variable, and it has higher priority than which is defined in Variable Table

### Fixed
- Goto definition runs failed when the resource file is writed as absolute path

## 0.2.6 - 2017-05-18
### Fixed
- Fix goto definition runs failure when user modify test case file and run search

### Removed
- Removed cache subsystem in the plugins, cause it comes to a bug mentions above, but the cache subsystem will be added in the future

## 0.2.2 - 2017-02-04
### Added
- Add cache for keyword and variable search result
- refactor test code and restruct resource used for unittest code

## 0.2.1 - 2017-01-25
### Added
- Support goto variable definition

## 0.1.0 - 2017-01-13
### Added
- Support gramma highlight and goto keyword definition