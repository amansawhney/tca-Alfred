# Mongoose Model Update

[![NPM](https://nodei.co/npm/mongoose-model-update.png?downloads=true)](https://nodei.co/npm/mongoose-model-update/)

[Mongoose] plugin providing a Model method for simple, filtered patch-style updates


## Setup

Install

```shell
npm install --save mongoose-model-update
```

Require this alongside your router-

```javascript
import update from 'mongoose-model-update';
// Or, for ES5-
// var update = require('mongoose-model-update');
```


## Usage

When registering the Mongoose plugin, you can optionally specify allowed fields
at the Model-level to be used as default params in `Model.methods.update()`.

```javascript
Model.plugin(update, ['name', 'bday', 'city']);
```

You can specify permitted fields to update in the 2nd argument. If no fields are
provided and default params aren't set at the Model-level, then all fields will
be available to update.

```javascript
user.update(source, ['age'])
```


## Use cases

At [AutoLotto], we use this for PATCH API updates (RESTfully speaking). Ex-

```javascript
export async function update(req, res) {
  // ...
  req.user.update(req.body);
  // ...
}
```


[Mongoose]: http://mongoosejs.com
[AutoLotto]: https://autolotto.com
