import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

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
