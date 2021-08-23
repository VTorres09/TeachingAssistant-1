import { defineSupportCode } from 'cucumber';
import { element, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

var base_url = "http://localhost:3000/";

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

defineSupportCode(function ({ Given, When, Then }) {
    Then('I see that the student with CPF {stringInDoubleQuotes} has “Notificações de email” variable {stringInDoubleQuotes}', async (cpf, expect) => {
        await assertElementWithEmailNotifications(cpf, expect === 'enabled');
    });

    When('I {stringInDoubleQuotes} the “Notificações de email” from the student with CPF {stringInDoubleQuotes}', async (enable, cpf) => {
        await setElementWithEmailNotifications(<string> cpf, (<string> enable) === 'enable');
    });

    Then(/^I see that the student with CPF "(\d*)" didn’t receive an email that day$/, async(cpf) => {
        const alunos = JSON.parse(await request.get(base_url + "alunos"));
        const aluno = alunos.find(currentAluno => currentAluno.cpf == cpf);
        const dayInMilliseconds = 86400000;
        const dateNow = (new Date()).getTime();
        const lastEmailDate = (new Date(aluno.lastEmail)).getTime();
        expect(dateNow - lastEmailDate > dayInMilliseconds);
    });

    Then('I see that the student with CPF {stringInDoubleQuotes} already received an email that day', async(cpf) => {
        const alunos = JSON.parse(await request.get(base_url + "alunos"));
        const aluno = alunos.find(currentAluno => currentAluno.cpf == cpf);
        const dayInMilliseconds = 86400000;
        const dateNow = (new Date()).getTime();
        const lastEmailDate = (new Date(aluno.lastEmail)).getTime();
        expect((dateNow - lastEmailDate) <= dayInMilliseconds);
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

    Then(/^an email notifying the student with CPF "(\d*)" that a grade has been updated isn't sent$/, async(cpf) => {
        const alunos = JSON.parse(await request.get(base_url + "alunos"));
        const aluno = alunos.find(currentAluno => currentAluno.cpf == cpf);
        var medias = {
            "requisitos": 5,
            "gerDeConfiguracao": 5
        };
        var options:request.RequestPromiseOptions = {method:"POST", body: {aluno, medias}, json: true};
        request(base_url + "sendemail", options).catch(err => 
            expect(JSON.stringify(err.error)).to.equal(
                '{"result":"Esse aluno já recebeu email hoje"}'
            ));
    });

    Then(/^the student with CPF "(\d*)" no longer receive emails from the system in this day$/, async(cpf) => {
        const alunos = JSON.parse(await request.get(base_url + "alunos"));
        const aluno = alunos.find(currentAluno => currentAluno.cpf == cpf);
        aluno.lastEmail = new Date();
        var options:request.RequestPromiseOptions = {method: "PUT", body: aluno, json: true};
        request(base_url + "aluno", options).then(body => 
            expect(JSON.stringify(body)).to.equal(
                '{"success":"O aluno foi atualizado com sucesso"}'
        ));
    });
})
