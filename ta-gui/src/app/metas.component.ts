import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import { Aluno } from '../../../common/aluno';
import { AlunoService } from './aluno.service';

  @Component({
   selector: 'metas',
   templateUrl: './metas.component.html',
   styleUrls: ['./metas.component.css']
 })
 export class MetasComponent implements OnInit {
    constructor(private alunoService: AlunoService) {}

    alunos: Aluno[];

    atualizarAluno(aluno: Aluno): void {
      this.alunoService.atualizar(aluno).subscribe(
         (a) => { if (a == null) alert("Unexpected fatal error trying to update student information! Please contact the systems administratos."); },
         (msg) => { alert(msg.message); }
      );
    }

    updateGrades(): void{
      this.alunos.map((aluno) => {
        var currentDate: Date = new Date();
        aluno.lastEmail = new Date(aluno.lastEmail);
        // No máximo 1 dia check
        if((currentDate.getTime() - aluno.lastEmail.getTime()) > 86400){
          this.alunoService.sendEmail(aluno).subscribe();
          aluno.lastEmail = new Date();
          this.alunoService.atualizar(aluno).subscribe(
            (a) => { if (a == null) alert("Unexpected fatal error trying to update student information! Please contact the systems administratos."); },
            (msg) => { alert(msg.message); }
          );
        }
      })
    }

    ngOnInit(): void {
      this.alunoService.getAlunos()
      .subscribe(
         (as) =>  { this.alunos = as; },
         (msg) => { alert(msg.message); }
      );
    }


  }