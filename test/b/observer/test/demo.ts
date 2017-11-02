abstract class MySubject {
    protected observerCollection: Array<any>;//存放觀察者
    constructor() {
        this.observerCollection = [];
    }
    //注册方法
    public attach(observer: MyObserver): void {
        this.observerCollection.push(observer);
    }
    //注销方法
    public detach(observer: MyObserver): void {
        let index = this.observerCollection.indexOf(observer);
        if (index >= 0) this.observerCollection.splice(index, 1);
    }
    public abstract cry(): void;//抽象通知方法
}

interface MyObserver {
    response(): void; //抽象响应方法
}

class Cat extends MySubject {
    public cry(): void {
        console.log("------");
        console.log("猫叫！");
        console.log("------");
        this.observerCollection.forEach((obs: MyObserver) => obs.response());
    }
}

class Dog implements MyObserver {
    public response(): void {
        console.log("狗跟着叫！");
    }
}

class Mouse implements MyObserver {
    protected name: string;
    constructor(name: string) {
        this.name = name;
    }
    public response(): void {
        console.log(`老鼠${this.name}努力逃跑！`);
    }
}

class Pig implements MyObserver {
    public response(): void {
        console.log("猪没有反应！");
    }
}


let cat = new Cat();

let mouse1 = new Mouse('m1');
let mouse2 = new Mouse('m2');
let dog = new Dog();

cat.attach(mouse1);
cat.attach(mouse2);
cat.attach(dog);

let pig = new Pig();
cat.attach(pig);

cat.cry();	

cat.detach(mouse2);
cat.cry();