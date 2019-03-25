"use strict";

require("@babel/polyfill");

var _prismaClient = require("../generated/prisma-client");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var DateStartTime = new Date(2019, 3, 25);

var getTimeByTimeZone = function getTimeByTimeZone(timeZone) {
  var d = new Date();
  var localTime = d.getTime();
  var localOffset = d.getTimezoneOffset() * 60000;
  var utc = localTime + localOffset;
  var offset = timeZone;
  var localSecondTime = utc + 3600000 * offset;
  var date = new Date(localSecondTime);
  return date;
};

var birthdayToAge = function birthdayToAge(day) {
  var birthday = new Date(day);
  var d = new Date();
  var age = d.getFullYear() - birthday.getFullYear() - (d.getMonth() < birthday.getMonth() || d.getMonth() === birthday.getMonth() && d.getDate() < birthday.getDate() ? 1 : 0);
  return age;
};

var now = getTimeByTimeZone(8);
var phase = parseInt("".concat((now.getTime() - DateStartTime.getTime()) / 1000 / 60 / 60 / 24 / 7), 10) + 1;

var match =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var cities, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, lovecity, cityLoveSignUps, signUpPersons, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, citLoveSignUp, person, loveSetting, grade, newPerson, sortedSignUpPersons, matchedPersons, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _person, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, matcher, womanId, manId, pastLoveMatchings, personId;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _prismaClient.prisma.cities();

          case 2:
            cities = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 6;
            _iterator = cities[Symbol.iterator]();

          case 8:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 129;
              break;
            }

            lovecity = _step.value;
            _context.next = 12;
            return _prismaClient.prisma.loveSignUps({
              where: {
                AND: [{
                  city: {
                    code: lovecity.code
                  }
                }, {
                  period: "".concat(phase)
                }]
              }
            });

          case 12:
            cityLoveSignUps = _context.sent;
            // 2、对该城市的所有用户按照会员级别进行排序，得到一个用户列表
            signUpPersons = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 17;
            _iterator2 = cityLoveSignUps[Symbol.iterator]();

          case 19:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 39;
              break;
            }

            citLoveSignUp = _step2.value;
            _context.next = 23;
            return _prismaClient.prisma.loveSignUp({
              id: citLoveSignUp.id
            }).person();

          case 23:
            person = _context.sent;
            _context.next = 26;
            return _prismaClient.prisma.loveSignUp({
              id: citLoveSignUp.id
            }).person().loveSetting();

          case 26:
            loveSetting = _context.sent;
            // 计算会员等级
            grade = loveSetting.memeberGrade; // 如果会员等级为null，则grade为0

            if (!loveSetting.memeberGrade) {
              grade = 0;
            } // 如果会员过期了，则grade为0


            if (!loveSetting.memeberGradeEndTime) {
              _context.next = 34;
              break;
            }

            if (!(new Date(loveSetting.memeberGradeEndTime) < new Date())) {
              _context.next = 34;
              break;
            }

            _context.next = 33;
            return _prismaClient.prisma.updateLoveSetting({
              where: {
                id: loveSetting.id
              },
              data: {
                memeberGrade: 0,
                memeberGradeEndTime: null
              }
            });

          case 33:
            grade = 0;

          case 34:
            newPerson = {
              id: person.id,
              gender: person.gender,
              age: birthdayToAge(person.birthday),
              myHeight: loveSetting.myHeight,
              myWeight: loveSetting.myWeight,
              otherAgeMin: loveSetting.otherAgeMin,
              otherAgeMax: loveSetting.otherAgeMax,
              otherHeightMin: loveSetting.otherHeightMin,
              otherHeightMax: loveSetting.otherHeightMax,
              otherWeightMin: loveSetting.otherWeightMin,
              otherWeightMax: loveSetting.otherWeightMax,
              memeberGrade: grade
            };
            signUpPersons.push(newPerson);

          case 36:
            _iteratorNormalCompletion2 = true;
            _context.next = 19;
            break;

          case 39:
            _context.next = 45;
            break;

          case 41:
            _context.prev = 41;
            _context.t0 = _context["catch"](17);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 45:
            _context.prev = 45;
            _context.prev = 46;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 48:
            _context.prev = 48;

            if (!_didIteratorError2) {
              _context.next = 51;
              break;
            }

            throw _iteratorError2;

          case 51:
            return _context.finish(48);

          case 52:
            return _context.finish(45);

          case 53:
            // 报名者按照等级从高到低排序
            sortedSignUpPersons = signUpPersons.sort(function (a, b) {
              return b.memeberGrade - a.memeberGrade;
            }); // 3、从第一个用户开始计算匹配，匹配到计入数据库。

            matchedPersons = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 58;
            _iterator3 = sortedSignUpPersons[Symbol.iterator]();

          case 60:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 112;
              break;
            }

            _person = _step3.value;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context.prev = 65;
            _iterator4 = sortedSignUpPersons[Symbol.iterator]();

          case 67:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context.next = 85;
              break;
            }

            matcher = _step4.value;
            womanId = void 0;
            manId = void 0;

            if (_person.gender === "male") {
              manId = _person.id;
              womanId = matcher.id;
            } else {
              manId = matcher.id;
              womanId = _person.id;
            } // 如果匹配成功


            if (!(!~matchedPersons.indexOf(_person.id) && !~matchedPersons.indexOf(matcher.id) && _person.gender !== matcher.gender && _person.age >= matcher.otherAgeMin && _person.age <= matcher.otherAgeMax && _person.myHeight <= matcher.otherHeightMax && _person.myHeight >= matcher.otherHeightMin && _person.myWeight <= matcher.otherWeightMax && _person.myWeight >= matcher.otherWeightMin && matcher.age >= _person.otherAgeMin && matcher.age <= _person.otherAgeMax && matcher.myHeight >= _person.otherHeightMin && matcher.myHeight <= _person.otherHeightMax && matcher.myWeight >= _person.otherWeightMin && matcher.myWeight <= _person.otherWeightMax)) {
              _context.next = 82;
              break;
            }

            _context.next = 75;
            return _prismaClient.prisma.loveMatchings({
              where: {
                AND: [{
                  woman: {
                    id: womanId
                  }
                }, {
                  man: {
                    id: manId
                  }
                }]
              }
            });

          case 75:
            pastLoveMatchings = _context.sent;

            if (!(pastLoveMatchings.length === 0)) {
              _context.next = 82;
              break;
            }

            matchedPersons.push(_person.id);
            matchedPersons.push(matcher.id);
            _context.next = 81;
            return _prismaClient.prisma.createLoveMatching({
              period: "".concat(phase),
              city: {
                connect: {
                  code: lovecity.code
                }
              },
              woman: {
                connect: {
                  id: womanId
                }
              },
              man: {
                connect: {
                  id: manId
                }
              }
            });

          case 81:
            return _context.abrupt("break", 85);

          case 82:
            _iteratorNormalCompletion4 = true;
            _context.next = 67;
            break;

          case 85:
            _context.next = 91;
            break;

          case 87:
            _context.prev = 87;
            _context.t1 = _context["catch"](65);
            _didIteratorError4 = true;
            _iteratorError4 = _context.t1;

          case 91:
            _context.prev = 91;
            _context.prev = 92;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 94:
            _context.prev = 94;

            if (!_didIteratorError4) {
              _context.next = 97;
              break;
            }

            throw _iteratorError4;

          case 97:
            return _context.finish(94);

          case 98:
            return _context.finish(91);

          case 99:
            // 没有匹配成功,对象为null
            personId = _person.id;

            if (~matchedPersons.indexOf(_person.id)) {
              _context.next = 109;
              break;
            }

            matchedPersons.push(personId);

            if (!(_person.gender === "male")) {
              _context.next = 107;
              break;
            }

            _context.next = 105;
            return _prismaClient.prisma.createLoveMatching({
              period: "".concat(phase),
              city: {
                connect: {
                  code: lovecity.code
                }
              },
              man: {
                connect: {
                  id: personId
                }
              }
            });

          case 105:
            _context.next = 109;
            break;

          case 107:
            _context.next = 109;
            return _prismaClient.prisma.createLoveMatching({
              period: "".concat(phase),
              city: {
                connect: {
                  code: lovecity.code
                }
              },
              woman: {
                connect: {
                  id: personId
                }
              }
            });

          case 109:
            _iteratorNormalCompletion3 = true;
            _context.next = 60;
            break;

          case 112:
            _context.next = 118;
            break;

          case 114:
            _context.prev = 114;
            _context.t2 = _context["catch"](58);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t2;

          case 118:
            _context.prev = 118;
            _context.prev = 119;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 121:
            _context.prev = 121;

            if (!_didIteratorError3) {
              _context.next = 124;
              break;
            }

            throw _iteratorError3;

          case 124:
            return _context.finish(121);

          case 125:
            return _context.finish(118);

          case 126:
            _iteratorNormalCompletion = true;
            _context.next = 8;
            break;

          case 129:
            _context.next = 135;
            break;

          case 131:
            _context.prev = 131;
            _context.t3 = _context["catch"](6);
            _didIteratorError = true;
            _iteratorError = _context.t3;

          case 135:
            _context.prev = 135;
            _context.prev = 136;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 138:
            _context.prev = 138;

            if (!_didIteratorError) {
              _context.next = 141;
              break;
            }

            throw _iteratorError;

          case 141:
            return _context.finish(138);

          case 142:
            return _context.finish(135);

          case 143:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 131, 135, 143], [17, 41, 45, 53], [46,, 48, 52], [58, 114, 118, 126], [65, 87, 91, 99], [92,, 94, 98], [119,, 121, 125], [136,, 138, 142]]);
  }));

  return function match() {
    return _ref.apply(this, arguments);
  };
}();

console.log('match start...');
match();
console.log('match over!');
//# sourceMappingURL=match.js.map