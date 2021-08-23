import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

var base_url = "http://localhost:3000/";

let sameCPF = ((elem, cpf) => elem.element(by.name('cpflist')).getText().then(text => text === cpf));
let sameEmail = ((elem, email) => elem.element(by.name('emaillist')).getText().then(text => text === email));
let sameName = ((elem, name) => elem.element(by.name('nomelist')).getText().then(text => text === name));

let pAND = ((p,q) => p.then(a => q.then(b => a && b)))

async function criarAluno(name, cpf) {
    await $("input[name='namebox']").sendKeys(<string> name);
    await $("input[name='cpfbox']").sendKeys(<string> cpf);
    await element(by.buttonText('Adicionar')).click();
}

async function assertTamanhoEqual(set,n) {
    await set.then(elems => {expect(Promise.resolve(elems.length)).to.eventually.equal(n)});
}

async function assertElementsWithSameCPFAndName(n,cpf,name) { 
    var allalunos : ElementArrayFinder = element.all(by.name("alunolist"));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
    await assertTamanhoEqual(samecpfsandname,n);
}

async function assertElementsWithSameCPF(n,cpf) {
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var samecpfs = allalunos.filter(elem => sameCPF(elem,cpf));
    await assertTamanhoEqual(samecpfs,n); 
}
async function assertElementsWithSameEmail(n,email) {
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var sameemails = allalunos.filter(elem => sameEmail(elem,email));
    await assertTamanhoEqual(sameemails,n); 
}

async function assertElementWithEmailNotifications(cpf, expected) {
    const alunoCpf = await element(by.cssContainingText('td', cpf)).getWebElement();
    const aluno = await alunoCpf.getDriver();
    const checkbox = await aluno.findElement(by.name("notificacaoEmail"));
    const value = await checkbox.isSelected();
    return value === expected;
}

async function setElementWithEmailNotifications(cpf: string, enabled: boolean) {
    const alunoCpf = await element(by.cssContainingText('td', cpf)).getWebElement();
    const aluno = await alunoCpf.getDriver();
    const checkbox = await aluno.findElement(by.name("notificacaoEmail"));
    const value = await checkbox.isSelected()
    if(enabled !== value) await checkbox.click();
}

async function setElementWithGrades(cpf: string, firstGrade: string, secondGrade: string) {
    const alunoCpf = await element(by.cssContainingText('td', cpf)).getWebElement();
    const aluno = await alunoCpf.getDriver();
    const first = await aluno.findElement(by.name("reqgrade"));
    await first.sendKeys(firstGrade);
    const second = await aluno.findElement(by.name("gergrade"));
    await second.sendKeys(secondGrade);
}

defineSupportCode(function ({ Given, When, Then }) {

    Then(/^I write "(\d*)" and "(\d*)" on the grades of the student with CPF "(\d*)"$/, async (firstGrade, secondGrade, cpf) => {
        setElementWithGrades(<string> cpf,<string> firstGrade,<string> secondGrade)
    });

    Then(/^I go to the metas page$/, async () => {
        await $("a[name='metas']").click();           
    });
    
    Given(/^I am at the metas page$/, async () => {
        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='metas']").click();
    });
})
