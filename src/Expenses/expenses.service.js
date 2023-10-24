'use strict';

const { usersService } = require('../Users/users.service');

const expenses = [];

const getAllExps = (req, res) => {
  const { userId, categories, from, to } = req.query;

  let results = expenses;

  if (userId != null) {
    results = results
      .filter(expense => expense.userId === Number(userId));
  }

  if (categories) {
    results = results
      .filter(expense => categories.includes(expense.category));
  }

  if (from) {
    const fromDate = new Date(from);

    results = results
      .filter(expense => fromDate <= new Date(expense.spentAt)
      );
  }

  if (to) {
    const toDate = new Date(to);

    results = results
      .filter(expense => toDate >= new Date(expense.spentAt));
  }

  res.status(200).send(results);
};

const getExp = (req, res) => {
  const expense = expenses.find(exp => exp.id === Number(req.params.id));

  if (!expense) {
    return res.sendStatus(404);
  }

  res.status(200).send(expense);
};

const postExp = (req, res) => {
  const { userId, spentAt, title, amount, category, note } = req.body;

  if (userId == null || !title || amount == null || !category) {
    return res.sendStatus(400);
  }

  usersService.getUser(userId);

  const expense = {
    id: expenses.length,
    userId,
    spentAt: spentAt || new Date().toISOString(),
    title,
    amount,
    category,
    note: note || '',
  };

  expenses.push(expense);

  res.status(200).send(expense);
};

const patchExp = (req, res) => {
  const expense = expenses
    .find(exp => exp.id === Number(req.params.id));

  if (!expense) {
    res.sendStatus(404);
  }

  const { spentAt, title, amount, category, note } = req.body;

  if (spentAt) {
    expense.spentAt = spentAt;
  }

  if (title) {
    expense.title = title;
  }

  if (amount != null) {
    expense.amount = amount;
  }

  if (category) {
    expense.category = category;
  }

  if (note) {
    expense.note = note;
  }

  res.status(200).send(expense);
};

const deleteExp = (req, res) => {
  const expense = expenses
    .find(exp => exp.id === Number(req.params.id));

  if (!expense) {
    return res.sendStatus(404);
  }

  const index = expenses.indexOf(expense);

  expenses.splice(index, 1);

  res.status(204).end();
};

const expensesService = {
  getAllExps,
  getExp,
  postExp,
  patchExp,
  deleteExp,
};

module.exports = {
  expensesService,
};
