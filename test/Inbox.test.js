const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {interface,bytecode} = require("../compile");


// class Car {
//   park() {
//     return "stopped";
//   }
//
//   drive() {
//     return "vroom";
//   }
// }
//
// let car;
// beforeEach(()=>{
//   car = new Car();
// });
//
// describe('Car class', ()=>{
//   it('can park',()=>{
//     assert.equal(car.park(),"stopped");
//   });
//
//   it('can drive',()=>{
//     assert.equal(car.drive(),"vroom");
//   });
// });


let accounts;
let inbox;
beforeEach(async()=>{
  accounts=await web3.eth.getAccounts();

  inbox=await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data:bytecode,
      arguments:["Hello world!"]
    })
    .send({
      from:accounts[0],
      gas:"1000000"
    });
});

describe("Tnbox",()=>{
  it("deploys a contract",()=>{
    assert.ok(inbox.options.address);
  });

  it("has a default message", async()=>{
    const message = await inbox.methods.message().call();
    assert.equal(message,"Hello world!");
  });

  it("can change the message", async()=>{
    await inbox.methods.setMessage("bye world!").send({ from:accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message,"bye world!");
  });
});
