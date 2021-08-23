Feature: As a professor
         I want to manage the email sent to students
         So that my students can be notified when grades are changed

Scenario: Enviar email com notas (Caso ele não tenha recebido nenhum)
Given I am at the students page                                                                      
Given I can see a student with CPF "684" in the students list                                        
Then I go to the metas page        
Then I write "8" and "9" on the grades of the student with CPF "684"                                 
And I see that the student with CPF "684" has “Notificações de email” variable "enabled"         
And I see that the student with CPF "684" didn’t receive an email that day                      
Then an email notifying the student with CPF "684" that a grade has been updated is sent
And the student with CPF "684" no longer receive emails from the system in this day

Scenario: Enviar email com notas (Caso ele tenha recebido)
Given I am at the students page
Given I can see a student with CPF "684" in the students list
Then I go to the metas page
And I write "8" and "9" on the grades of the student with CPF "684"
And I see that the student with CPF "684" has “Notificações de email” variable "enabled"
And I see that the student with CPF "684" already received an email that day
Then an email notifying the student with CPF "684" that a grade has been updated isn't sent  

Scenario: Desativar as notificações de email
Given I am at the metas page                                                     
When I "disable" the “Notificações de email” from the student with CPF "684"
Then I see that the student with CPF "684" has “Notificações de email” variable "disabled"

Scenario: Ativar as notificações de email
Given I am at the metas page                                        
When I "enable" the “Notificações de email” from the student with CPF "684"
Then I see that the student with CPF "684" has “Notificações de email” variable "disabled"
              
