const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
module.exports = menuItemsRouter;

const sqlite3 = require('sqlite3'); 
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite'); 

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`, (error, row) => {
    if(error) {
      next(error);
    } else if(row){
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

menuItemsRouter.get('/', (req, res, next) => {
  const menuId = req.params.menuId;
  db.all(`SELECT * FROM MenuItem WHERE menu_id = ${menuId}`, (error, rows) => {
    if(error) {
      next(error);
    } else {
      res.status(200).send({menuItems: rows});
    }
  });
});

menuItemsRouter.post('/', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        menuId = req.params.menuId;

  if(!name || !inventory || !price) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';
  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuId: menuId
  };

  db.run(sql, values, function(error){
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (error, row) => {
        res.status(201).send({menuItem: row});
      });
    }
  });
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        menuItemId = req.params.menuItemId;


  if(!name || !inventory || !price) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $menuItemId';
  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuItemId: menuItemId
  };
  db.run(sql, values, error => {
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`, (error, row) => {
        res.status(200).send({menuItem: row});
      });
    }
  });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  const menuItemId = req.params.menuItemId;
  db.run(`DELETE FROM MenuItem WHERE id = ${menuItemId}`, error => {
    if(error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});