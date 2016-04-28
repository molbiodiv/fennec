# How to contribute

Any contribution is highly appreciated.
We need contributors to follow this guideline to keep the project manageable.

## Getting Started

* Make sure you have a [GitHub account](https://github.com/signup/free)
* Submit a ticket for your issue, assuming one does not already exist.
  * Clearly describe the issue including steps to reproduce when it is a bug.
  * Make sure you fill in the earliest version that you know has the issue.
* Fork the repository on GitHub
* See the Getting Started section of the README

## Making Changes

* Create a topic branch from where you want to base your work.
  * This is usually the master branch.
  * To quickly create a topic branch based on master; `git checkout -b
    fix/master/my_contribution master`. Please avoid working directly on the
    `master` branch.
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure to check for lints and coding conventions with either
  `gulp scssLint` (scss) or `gulp jshint` (javascript) or `gulp phpcs` (PHP).
  Coding conventions for PHP are [PSR-2](http://www.php-fig.org/psr/psr-2/)
* Make sure your commit messages are in the proper format.
  See the seven rules in [this blog post](http://chris.beams.io/posts/git-commit/).
  Do not forget to reference your ticket by its number (e.g. Fix #23)
* Make sure you have added the necessary tests for your changes.
* Run _all_ the tests to assure nothing else was accidentally broken.
* Make sure to add proper documentation and recreate it using either
  `gulp apigen` (PHP webservices) or `gulp jsdoc` (javascript helpers)

## Making Trivial Changes

### Documentation

For changes of a trivial nature to comments and documentation, it is not
always necessary to create a new ticket.

## Submitting Changes

* Push your changes to a topic branch in your fork of the repository.
* Submit a pull request to the base repository.
* Sign the Contributor License Agreement that will be added as a comment to your Pull Request.
* Wait for the core developers to comment on your pull request or directly merge it.
* After feedback has been given we expect responses within two weeks. After two
  weeks we may close the pull request if it isn't showing any activity.

# Additional Resources

* This document is derived from [the puppet CONTRIBUTING guidelines](https://raw.githubusercontent.com/puppetlabs/puppet/master/CONTRIBUTING.md)
