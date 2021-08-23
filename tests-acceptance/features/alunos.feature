Feature: As a professor
         I want to register students
         So that I can manage their learning goals

Scenario: Registering student with non registered CPF
Given I am at the students page
Given I cannot see a student with CPF "683" in the students list
When I try to register the student "Mari" with CPF "683"
Then I can see "Mari" with CPF "683" in the students list

Scenario: Registering student with registered CPF
Given I am at the students page
Given I can see a student with CPF "684" in the students list
When I try to register the student "Pedro" with CPF "684"
Then I cannot see "Pedro" with CPF "684" in the students list
And I can see an error message

Scenario: Registering student with non registered CPF, service
Given the system has no student with CPF "685" 
When I register the student "Paulo" with CPF "685"
Then the system now stores "Paulo" with CPF "685"

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////////////////  NOSSO  /////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Scenario: Enviar email com notas (Caso ele não tenha recebido nenhum)
Given I am at the students page                                                                      
Given I can see a student with CPF "684" in the students list                                        
Then I go to the metas page        
Then I write "8" and "9" on the grades of the student with CPF "684"                                 
And I see that the student with CPF "684" has “Notificações de email” variable "enabled"         
And I see that the student with CPF "684" didn’t receive an email that day                      
Then an email notifying the student with CPF "684" that a grade has been updated is sent
And the student with CPF "684" no longer receive emails from the system in this day

Scenario: Desativar as notificações de email
Given I am at the metas page                                                     
When I "disable" the “Notificações de email” from the student with CPF "684"
Then I see that the student with CPF "684" has “Notificações de email” variable "disabled"


Scenario: Ativar as notificações de email
Given I am at the metas page                                        
When I "enable" the “Notificações de email” from the student with CPF "684"
Then I see that the student with CPF "684" has “Notificações de email” variable "disabled"
                

Scenario: Enviar email com notas (Caso ele tenha recebido)
Given I am at the students page
Given I can see a student with CPF "684" in the students list
Then I go to the metas page
And I write "8" and "9" on the grades of the student with CPF "684"
And I see that the student with CPF "684" has “Notificações de email” variable "enabled"
And I see that the student with CPF "684" already received an email that day
Then an email notifying the student with CPF "684" that a grade has been updated isn't sent     

