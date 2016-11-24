# [4IT445: Agilní vývoj webových aplikací](http://4it445.vse.cz/) na [VŠE](https://www.vse.cz/)
MySQL:
ALTER TABLE `Message` ADD FOREIGN KEY (buddy_id_from) REFERENCES Buddy(id);
ALTER TABLE `Message` ADD FOREIGN KEY (buddy_id_to) REFERENCES Buddy(id);
ALTER TABLE `Request` ADD FOREIGN KEY (buddy_id) REFERENCES Buddy(id);
ALTER TABLE `Request` MODIFY COLUMN `from` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `Buddy` MODIFY COLUMN `about_me` TEXT;
ALTER TABLE `Message` MODIFY COLUMN `date_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `Request` MODIFY COLUMN `text` TEXT;
ALTER TABLE `Message` MODIFY COLUMN `text` TEXT;
ALTER TABLE `Message` MODIFY COLUMN `displayed` tinyint(1)	DEFAULT 0;

INSERT INTO `Buddy` (`id`, `email`, `password`, `sex`, `name`, `surname`, `city`, `about_me`, `is_hosting`) VALUES
(1, 'karel.pacovsky@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Karel', 'Pacovský', 'Olomouc', NULL, 1),
(2, 'tobias.seborsky@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Tobiáš', 'Seborský', 'Olomouc', NULL, 1),
(3, 'lukas.kouba@email.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Lukáš', 'Kouba', 'Liberec', NULL, 1),
(4, 'karolina.kebova@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'female', 'Karolína', 'Kebová', 'Praha', NULL, 1),
(5, 'patrik.strnad@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Patrik', 'Strnad', 'Praha', NULL, 1),
(6, 'tests@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Evžen', 'Radkovský', 'Ostrava', NULL, 0),
(7, 'user226@monitoring.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Lucie', 'Radlicka', 'Ostrava', NULL, 0),
(8, 'lol00@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Jaroslava', 'Krejcová', 'Praha', NULL, 0),
(9, 'lukisjama@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Lukáš', 'Marek', 'Praha', NULL, 0),
(10, 'anonym@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Evžen', 'Ctiborský', 'Brno', NULL, 0),
(11, '1karel.pacovsky@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'David', 'Pacovský', 'Olomouc', NULL, 1),
(12, '1tobias.seborsky@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'David', 'Seborský', 'Liberec', NULL, 1),
(13, '1lukas.kouba@email.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Lukáš', 'David', 'Liberec', NULL, 1),
(14, '1karolina.kebova@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'female', 'Eliška', 'Kebová', 'Praha', NULL, 1),
(15, '1patrik.strnad@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'David', 'Strnad', 'Praha', NULL, 1),
(16, '1tests@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'David', 'Radkovský', 'Ostrava', NULL, 0),
(17, '1user226@monitoring.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Eliška', 'Radlicka', 'Ostrava', NULL, 0),
(18, '1lol00@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Eliška', 'Krejcová', 'Praha', NULL, 0),
(19, '1lukisjama@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'David', 'Marek', 'Praha', NULL, 0),
(20, '1anonym@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'David', 'Ctiborský', 'Brno', NULL, 0),
(21, '2karel.pacovsky@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Pacovský', 'Olomouc', NULL, 1),
(22, '2tobias.seborsky@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Seborský', 'Liberec', NULL, 1),
(23, '2lukas.kouba@email.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Kouba', 'Liberec', NULL, 1),
(24, '2karolina.kebova@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'female', 'Monika', 'Kebová', 'Praha', NULL, 1),
(25, '2patrik.strnad@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Strnad', 'Praha', NULL, 1),
(26, '2tests@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Evžen', 'Radkovský', 'Ostrava', NULL, 0),
(27, '2user226@monitoring.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Monika', 'Radlicka', 'Ostrava', NULL, 0),
(28, '2lol00@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Monika', 'Krejcová', 'Praha', NULL, 0),
(29, '2lukisjama@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Aleš', 'Marek', 'Praha', NULL, 0),
(30, '2anonym@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Aleš', 'Ctiborský', 'Brno', NULL, 0),
(31, 'j.draslar@gmail.com', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Jordan', 'Karlovsky', 'Ostrava', NULL, 0),
(32, 'eee@email.cz', '$2a$10$iLXPn/ykeX9CREgtmXzC3.1tB9MqmCRT5azMSpzKPYEqOYLga5.S.', 'female', 'Jožorář', 'ěščřžýáíé', 'Kroměříž', 'áéčířžěéščřéíábé áétýšéíčátyéw ', 1),
(33, 'a@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Patrik', 'Kouba', 'Liberec', NULL, 1),
(34, 'b@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'female', 'Stanislava', 'Kebová', 'Praha', NULL, 1),
(35, 'c@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Radomír', 'Strnad', 'Praha', NULL, 1),
(36, 'd@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Francis', 'Radkovský', 'Ostrava', NULL, 0),
(37, 'e@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Alžběta', 'Radlicka', 'Ostrava', NULL, 0),
(38, 'f@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Josefína', 'Krejcová', 'Praha', NULL, 0),
(39, 'g@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Jan', 'Marek', 'Praha', NULL, 0),
(40, 'h@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Evžen', 'Ctiborský', 'Brno', NULL, 0),
(41, 'i@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'David', 'Pacovský', 'Olomouc', NULL, 1),
(42, 'j@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'David', 'Seborský', 'Liberec', NULL, 1),
(43, 'k@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Lukáš', 'David', 'Liberec', NULL, 1),
(44, 'l@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'female', 'Eliška', 'Kebová', 'Praha', NULL, 1),
(45, 'm@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'David', 'Strnad', 'Praha', NULL, 1),
(46, 'n@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'David', 'Radkovský', 'Ostrava', NULL, 0),
(47, 'o@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Eliška', 'Radlicka', 'Ostrava', NULL, 0),
(48, 'p@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Eliška', 'Krejcová', 'Praha', NULL, 0),
(49, 'q@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'David', 'Marek', 'Praha', NULL, 0),
(50, 'r@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'David', 'Ctiborský', 'Brno', NULL, 0),
(51, 's@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Pacovský', 'Olomouc', NULL, 1),
(52, 't@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Seborský', 'Liberec', NULL, 1),
(53, 'u@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Kouba', 'Liberec', NULL, 1),
(54, 'v@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'female', 'Monika', 'Kebová', 'Praha', NULL, 1),
(55, 'w@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'male', 'Martin', 'Strnad', 'Praha', NULL, 1),
(56, 'x@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Evžen', 'Radkovský', 'Ostrava', NULL, 0),
(57, 'y@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Monika', 'Radlicka', 'Ostrava', NULL, 0),
(58, 'z@seznam.cz', '$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai', 'na', 'Monika', 'Krejcová', 'Praha', NULL, 0);

INSERT INTO `Message` (`id`, `text`, `displayed`, `date_time`, `buddy_id_from`, `buddy_id_to`) VALUES
(1, 'Hi, this is sample message.', 0, '2016-11-24 12:39:48', 1, 2);


INSERT INTO `Request` (`id`, `text`, `city`, `from`, `to`, `buddy_id`) VALUES
(1, 'Nechtěl by mě někdo provést Prahou, jsem uživatel 1?', 'Praha', '2016-11-24 12:38:35', '2016-11-24 12:38:35', 1),
(3, 'Nechtěl by mě někdo provést Prahou, jsem uživatel 1?', 'Praha', '2016-11-24 12:39:48', '2016-11-24 12:39:48', 1);






## JavaScript

We will be using [Node.js](https://nodejs.org/) v6.6.0.
New JavaScript features (ES2015) are "enabled" for for all modern browsers with [Babel](https://babeljs.io/).

### Reference

- [JavaScript reference on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [Learn ES2015](https://babeljs.io/docs/learn-es2015/) + more:
  - [class properties](http://babeljs.io/docs/plugins/transform-class-properties/)
  - [object rest spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/)
  - [async functions](http://babeljs.io/docs/plugins/syntax-async-functions/)

### Literature

- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
  - [Up & Going](https://github.com/getify/You-Dont-Know-JS/blob/master/up%20&%20going/README.md)
  - [Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/README.md)
  - [this & Object](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20&%20object%20prototypes/README.md)
  - [ES6 & Beyond](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/README.md)
- [JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)

### JavaScript Packages

- [npm docs](https://docs.npmjs.com/cli/)
- Useful commands:
  - `npm install` (install local dependencies - based on `package.json` file)
  - `npm install --save <package-name>`
  - `npm run`
  - `npm run <command>`
- Search for packages:
  - **[npmsearch.com](http://npmsearch.com/)**
  - [js.coach/react](https://js.coach/react)
  - [awesome-react-components](http://devarchy.com/react-components)
  - [npmjs.com](https://www.npmjs.com/)

### React

- [React docs](https://facebook.github.io/react/docs/)
- app is created using [create-react-app](https://github.com/facebookincubator/create-react-app)

## Server Setup

## SSH

- `ssh username@vse.handson.pro`
- frontend code: `cd ~/code/cviceni/frontend`

### Domains

- [dev.frontend.**username**.vse.handson.pro](http://dev.frontend.username.vse.handson.pro)
- [frontend.**username**.vse.handson.pro](http://frontend.username.vse.handson.pro)
  - requires `npm run build`

