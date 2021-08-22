const dayInMilliseconds:number = 86400000;

export class Aluno {
  nome: string;
  cpf: string;
  email: string;
  metas: Map<string,string>;
  lastEmail: Date;
  notificacaoEmail: Boolean;

  constructor() {
    this.clean();
  }

  clean(): void {
    this.nome = "";
    this.cpf = "";
    this.email = "";
    this.lastEmail = new Date(2000,10,10);
    this.notificacaoEmail = true;
    this.lastEmail.setTime(this.lastEmail.getTime() - dayInMilliseconds);
    this.metas = new Map<string,string>();
  }

  clone(): Aluno {
    var aluno: Aluno = new Aluno();
    aluno.copyFrom(this);
    return aluno;
  }

  copyFrom(from: Aluno): void {
    this.nome = from.nome;
    this.cpf = from.cpf;
    this.email = from.email;
    this.copyMetasFrom(from.metas);
  }

  copyMetasFrom(from: Map<string,string>): void {
    this.metas = new Map<string,string>();
    for (let key in from) {
      this.metas[key] = from[key];
    }
  }
}