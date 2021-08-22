import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import { Aluno } from '../../../common/aluno';
import { AlunoService } from './aluno.service';

const dayInMilliseconds: number = 86400000;

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
      const total: Record<string, number> = {};
      const contador: Record<string, number> = {};
      for(let i = 0; i < this.alunos.length; i++) {
        const aluno = this.alunos[i];
        const keys = Object.keys(aluno.metas);
        for(let j = 0; j < keys.length; j++) {
          if(total[keys[j]] === undefined) total[keys[j]] = 0;
          total[keys[j]] += Number.parseFloat(aluno.metas[keys[j]]);
          if(contador[keys[j]] === undefined) contador[keys[j]] = 0;
          contador[keys[j]] += 1;
        }
      }
      const medias: Record<string, string> = {};
      const keys = Object.keys(total);
      for(let i = 0; i < keys.length; i++) {
        medias[keys[i]] = (total[keys[i]]/contador[keys[i]]).toString();
      }
      this.alunos.map((aluno) => {
        var currentDate: Date = new Date();
        aluno.lastEmail = new Date(aluno.lastEmail);
        // No máximo 1 dia check
        if((currentDate.getTime() - aluno.lastEmail.getTime()) > dayInMilliseconds){
          this.alunoService.sendEmail({aluno, medias }).subscribe();
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
