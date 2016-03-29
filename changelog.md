---
title: Change Log
permalink: /changelog
---

{% assign package = site.data.package %}
{% assign tags = site.data.tags %}

# Change Log

All notable changes to this project will be documented in this file.

<sub>This project adheres to [Semantic Versioning](http://semver.org/).
Changelog format adheres to [Keep a Changelog](http://keepachangelog.com/)</sub>

## [Unreleased]

### Added

- Replaced jshint with standardjs
- algebra-cyclic
- Scalar

## [v0.8.0] - 2016-03-20

### Added

- Everything is a Tensor
- Composition algebra class
- dynamic changelog

## [v0.7.0] - 2016-03-09

### Added

- CHANGELOG.md
- CDN installation instructions
- svg badges and github social badges
- first tensor implementation
- minified code and source map

[Unreleased]: https://github.com/fibo/{{ package.name }}/compare/v{{ package.version }}...HEAD
[v0.8.0]: https://github.com/fibo/{{ package.name }}/compare/v0.7.0...v0.8.0
[v0.7.0]: https://github.com/fibo/algebra/{{ package.name }}/v0.6.2...v0.7.0

## TODO

dynamic changelog

{% for tag in tags %}
* {{ tag.name }}
{% endfor %}