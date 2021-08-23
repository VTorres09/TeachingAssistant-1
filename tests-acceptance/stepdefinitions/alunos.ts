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
    Given(/^I am at the students page$/, async () => {
        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='alunos']").click();
    })

    Given(/^I cannot see a student with CPF "(\d*)" in the students list$/, async (cpf) => {
        await assertElementsWithSameCPF(0,cpf);
    });

    Then('I see that the student with CPF {stringInDoubleQuotes} has “Notificações de email” variable {stringInDoubleQuotes}', async (cpf, expect) => {
        await assertElementWithEmailNotifications(cpf, expect === 'enabled');
    });


    When(/^I try to register the student "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        await criarAluno(name,cpf);
    });

    Then(/^I can see "([^\"]*)" with CPF "(\d*)" in the students list$/, async (name, cpf) => {
        await assertElementsWithSameCPFAndName(1,cpf,name);
    });

    Given(/^I can see a student with CPF "(\d*)" in the students list$/, async (cpf) => {
        await criarAluno("Clarissa",cpf);
        await assertElementsWithSameCPF(1,cpf); 
    });

    Given(/^I can see a student with Email "(\d*)" in the students list$/, async (email) => {
        await assertElementsWithSameEmail(1,email); 
    });

    Then(/^I cannot see "([^\"]*)" with CPF "(\d*)" in the students list$/, async (name, cpf) => {
        await assertElementsWithSameCPFAndName(0,cpf,name);
    });

    Then(/^I can see an error message$/, async () => {
        var allmsgs : ElementArrayFinder = element.all(by.name('msgcpfexistente'));
        await assertTamanhoEqual(allmsgs,1);
    });

    Given(/^the system has no student with CPF "(\d*)"$/, async (cpf) => {
       await request.get(base_url + "alunos")
                .then(body => 
                   expect(body.includes(`"cpf":"${cpf}"`)).to.equal(false));
    });

    When(/^I register the student "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        const aluno = {"nome": name, "cpf" : cpf, "email":""};
        var options:request.RequestPromiseOptions = {method: 'POST', body: aluno, json: true};
        await request(base_url + "aluno", options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"O aluno foi cadastrado com sucesso"}'));
    });

    Then(/^the system now stores "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        
        let resposta = `{"nome":"${name}","cpf":"${cpf}","email":"","lastEmail":"1995-12-16T06:24:00.000Z","notificacaoEmail":true,"metas":{}}`;
        await request.get(base_url + "alunos")
                     .then(body => {
                         return expect(body.includes(resposta)).to.equal(true);
                        });
                     
    });

    Then(/^I write "(\d*)" and "(\d*)" on the grades of the student with CPF "(\d*)"$/, async (firstGrade, secondGrade, cpf) => {
        setElementWithGrades(<string> cpf,<string> firstGrade,<string> secondGrade)
        // await $("input[name='reqgrade']").sendKeys(<string> firstGrade);
        // await $("input[name='gergrade']").sendKeys(<string> secondGrade);
        //await element(by.buttonText('Adicionar')).click();
    });

    
    When('I {stringInDoubleQuotes} the “Notificações de email” from the student with CPF {stringInDoubleQuotes}', async (enable, cpf) => {
        await setElementWithEmailNotifications(<string> cpf, (<string> enable) === 'enable');
    });

    Then(/^I go to the metas page$/, async () => {
        await $("a[name='metas']").click();           
    });
    
    Given(/^I am at the metas page$/, async () => {
        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='metas']").click();
    });

    Then(/^I see that the student with CPF "(\d*)" didn’t receive an email that day$/, async(cpf) => {
        const alunos = JSON.parse(await request.get(base_url + "alunos"));
        const aluno = alunos.find(currentAluno => currentAluno.cpf == cpf);
        const dayInMilliseconds = 86400000;
        const dateNow = (new Date()).getTime();
        const lastEmailDate = (new Date(aluno.lastEmail)).getTime();
        expect(dateNow - lastEmailDate > dayInMilliseconds);
    });

    Then(/^an email notifying the student with CPF "(\d*)" that a grade has been updated is sent$/, async(cpf) => {
        const alunos = JSON.parse(await request.get(base_url + "alunos"));
        const aluno = alunos.find(currentAluno => currentAluno.cpf == cpf);
        var medias = {
            "requisitos": 5,
            "gerDeConfiguracao": 5
        };
        var options:request.RequestPromiseOptions = {method:"POST", body: {aluno, medias}, json: true};
        request(base_url + "sendemail", options).then(body => 
            expect(JSON.stringify(body)).to.equal(
                '{"result":"Email enviado com sucesso!"}'));
        
    });
})
