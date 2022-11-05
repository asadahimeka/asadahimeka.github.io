var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MySubject = /** @class */ (function () {
    function MySubject() {
        this.observerCollection = [];
    }
    //注册方法
    MySubject.prototype.attach = function (observer) {
        this.observerCollection.push(observer);
    };
    //注销方法
    MySubject.prototype.detach = function (observer) {
        var index = this.observerCollection.indexOf(observer);
        if (index >= 0)
            this.observerCollection.splice(index, 1);
    };
    return MySubject;
}());
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cat.prototype.cry = function () {
        console.log("------");
        console.log("猫叫！");
        console.log("------");
        this.observerCollection.forEach(function (obs) { return obs.response(); });
    };
    return Cat;
}(MySubject));
var Dog = /** @class */ (function () {
    function Dog() {
    }
    Dog.prototype.response = function () {
        console.log("狗跟着叫！");
    };
    return Dog;
}());
var Mouse = /** @class */ (function () {
    function Mouse(name) {
        this.name = name;
    }
    Mouse.prototype.response = function () {
        console.log("\u8001\u9F20" + this.name + "\u52AA\u529B\u9003\u8DD1\uFF01");
    };
    return Mouse;
}());
var Pig = /** @class */ (function () {
    function Pig() {
    }
    Pig.prototype.response = function () {
        console.log("猪没有反应！");
    };
    return Pig;
}());
var cat = new Cat();
var mouse1 = new Mouse('m1');
var mouse2 = new Mouse('m2');
var dog = new Dog();
cat.attach(mouse1);
cat.attach(mouse2);
cat.attach(dog);
var pig = new Pig();
cat.attach(pig);
cat.cry();
cat.detach(mouse2);
cat.cry();
