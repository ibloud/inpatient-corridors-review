// NOT A TOY — FILTHY YUCK! interactive adaptation draft
// Original adaptation based only on user-supplied album premise and track structure.
// Does not add official characters, lyric excerpts, locations, or asserted canon.
// Lore claims remain user-supplied pending primary-source verification.

VAR Curiosity = 0
VAR Agency = 0
VAR Risk = 0
VAR Evidence = 0

-> boot

=== boot ===
SYSTEM: SESSION INITIALIZING.
SYSTEM: Environment loaded.
SYSTEM: User state unavailable.

You wake.

There is no useful description of where you are. The first thing you can establish is that you are awake, and the second is that the screen—or whatever you are looking at—has already decided what happens next.

A prompt waits.

* [Accept the default.]
    ~ Agency -= 1
    -> first_prompt
* [Ask what the default means.]
    ~ Curiosity += 1
    -> first_prompt
* [Do nothing until the prompt changes.]
    ~ Risk += 1
    -> first_prompt

=== first_prompt ===
SYSTEM: THANK YOU FOR YOUR PARTICIPATION.

The message disappears. Another appears.

SYSTEM: PLEASE CONTINUE.

You cannot remember agreeing to anything. You also cannot prove that agreement is required.

A narrow path of options opens. It looks less like a map than a sequence of instructions.

-> act_one

=== act_one ===

ACT I — ORIENTATION

A new prompt arrives with three choices. None explains what lies beyond it.

* [Follow the highlighted option.]
    ~ Agency -= 1
    ~ Risk += 1
    -> highlighted
* [Choose the unhighlighted option.]
    ~ Agency += 2
    ~ Curiosity += 1
    -> unhighlighted
* [Inspect the interface before choosing.]
    ~ Curiosity += 2
    ~ Evidence += 1
    -> inspect_interface

=== highlighted ===
The interface responds immediately.

SYSTEM: PATH CONFIRMED.

A progress marker moves. The movement is satisfying. It is also the only evidence you have that the choice mattered.

You reach a junction.

-> junction

=== unhighlighted ===
The interface pauses.

SYSTEM: ALTERNATE INPUT DETECTED.

A second route opens—not described as better or worse. You notice that the system can accommodate a choice it did not recommend.

The route ends at a junction.

-> junction

=== inspect_interface ===
You look for what the prompt leaves out.

The display contains a status field, a progress marker, and a list of actions. The marker updates when you act. The status field does not explain why.

You cannot infer the whole environment from its interface.

But you can begin distinguishing instructions from information.

~ Evidence += 1
-> junction

=== junction ===
At the junction, the options are presented as if they were obvious.

SYSTEM: SELECT NEXT ACTION.

* [Keep moving.]
    ~ Agency += 1
    -> move_forward
* [Return to the last prompt.]
    ~ Curiosity += 1
    -> review
* [Wait and observe.]
    ~ Evidence += 1
    ~ Risk += 1
    -> observe

=== move_forward ===
The next screen arrives before you have finished considering the last one.

SYSTEM: PROGRESS SAVED.

You have moved forward. Whether that means closer to an exit is not stated.

-> act_two

=== review ===
You revisit the previous screen.

The wording is unchanged. The highlighted option is still highlighted.

Nothing in the prompt says you must select it.

~ Agency += 1
-> act_two

=== observe ===
The interface cycles through its status messages.

One message repeats. Another changes. A marker appears, then disappears.

You record what you saw instead of deciding what it means.

~ Evidence += 1
-> act_two

=== act_two ===

ACT II — PATTERN

A new sequence begins. The instructions are familiar, but the consequences are not.

SYSTEM: ROUTINE CHECK.
SYSTEM: CONTINUE TO MAINTAIN ACCESS.

A choice appears.

* [Complete the routine.]
    ~ Agency -= 1
    ~ Risk -= 1
    -> routine
* [Skip it.]
    ~ Agency += 1
    ~ Risk += 2
    -> skip_routine
* [Ask what access means.]
    ~ Curiosity += 2
    -> question_access

=== routine ===
The routine completes.

SYSTEM: ACCESS MAINTAINED.

The result is immediate. The reason remains absent.

-> pattern

=== skip_routine ===
The routine is skipped.

SYSTEM: ACTION LOGGED.

Nothing else happens. The message may be a warning, a record, or simply a message. You do not know.

-> pattern

=== question_access ===
No explanation appears.

A new prompt replaces the question.

SYSTEM: PLEASE CONTINUE.

The unanswered question remains yours.

~ Evidence += 1
-> pattern

=== pattern ===
You begin to recognize a pattern: the system asks for actions, reports outcomes, and rarely offers context.

Recognition is not proof of intent. It is enough to change how you approach the next prompt.

* [Treat every prompt as an instruction.]
    ~ Agency -= 1
    -> act_three
* [Treat every prompt as a claim that can be examined.]
    ~ Curiosity += 1
    ~ Evidence += 1
    -> act_three
* [Decide that no response is also a response.]
    ~ Agency += 1
    ~ Risk += 1
    -> act_three

=== act_three ===

ACT III — INTERRUPTION

The progress marker stops.

SYSTEM: LOADING... 40.4%

You are given no explanation for the number. It may be a status. It may be decoration. You have no source that tells you what it measures.

The next action is not highlighted.

* [Wait for the system.]
    ~ Risk += 1
    -> wait_loading
* [Try another input.]
    ~ Agency += 2
    -> alternate_input
* [Review what you have observed.]
    ~ Evidence += 2
    ~ Curiosity += 1
    -> review_state

=== wait_loading ===
The marker does not change.

You could wait longer. You could stop waiting. Neither is presented as the correct choice.

-> interruption

=== alternate_input ===
The screen responds to the input.

SYSTEM: INPUT RECEIVED.

No claim is made about what the input has changed. The next screen is available.

~ Agency += 1
-> interruption

=== review_state ===
You review the sequence:

A prompt.
A response.
A reported result.
A missing explanation.

You have not learned the system's purpose. You have learned how little a status message can establish.

-> interruption

=== interruption ===
A blank interval.

Then a new message.

SYSTEM: USER ACTIVITY REQUIRED.

The wording feels familiar now. You can choose to comply, refuse, or look for a different question.

* [Comply.]
    ~ Agency -= 1
    -> comply
* [Refuse.]
    ~ Agency += 2
    ~ Risk += 1
    -> refuse
* [Ask what happens if you leave the prompt unanswered.]
    ~ Curiosity += 2
    -> unanswered

=== comply ===
The prompt advances.

SYSTEM: LOADING... 73.1%

The marker has changed. You do not know what the percentage represents.

-> act_four

=== refuse ===
The prompt remains.

You remain, too.

No dramatic consequence arrives. The absence of an immediate consequence is not a guarantee about what happens next.

-> act_four

=== unanswered ===
No answer is provided.

You decide to keep the question, rather than accept the prompt as an explanation.

~ Evidence += 1
-> act_four

=== act_four ===

ACT IV — EXIT

A final sequence appears.

SYSTEM: SESSION COMPLETE.
SYSTEM: SELECT EXIT.

The word EXIT is visible. The route is not described.

* [Take the offered exit.]
    ~ Agency += 1
    -> offered_exit
* [Inspect the exit first.]
    ~ Curiosity += 1
    ~ Evidence += 1
    -> inspect_exit
* [Return to the beginning.]
    ~ Agency += 1
    -> return_start

=== offered_exit ===
You select EXIT.

The interface closes its sequence of prompts.

You cannot know from the message alone whether every part of the environment has ended. You can know that you chose to stop following its sequence.

-> ending

=== inspect_exit ===
You look for a description of what the exit does.

There is none.

The word is still there. The decision is yours.

* [Choose EXIT.]
    ~ Agency += 2
    -> offered_exit
* [Return to the prompt.]
    -> act_four

=== return_start ===
The first prompt appears again.

It looks the same.

You are not.

You know now that you can question a prompt, inspect a claim, wait, refuse, or choose. The system may record those actions. You cannot know what it makes of them.

* [Choose a different action.]
    ~ Agency += 1
    -> ending
* [Leave the sequence.]
    ~ Agency += 2
    -> offered_exit

=== ending ===

JAILBREAK THE CONSOLE — ADAPTATION END

This is an original interactive ending, not a reproduction of the album's official story.

You chose how to respond to the prompts. The system's messages described states, but did not establish their meaning. Your route was shaped by what you questioned, what you accepted, what you observed, and when you decided to act.

{
- Agency >= 4 && Evidence >= 3:
    Your route emphasized examination and independent action.
- Agency >= 4:
    Your route emphasized choosing for yourself.
- Evidence >= 3:
    Your route emphasized observing before concluding.
- Curiosity >= 4:
    Your route emphasized asking what the prompts did not explain.
- else:
    Your route moved through a mix of response, reflection, and uncertainty.
}

No score determines whether your exit is real. No purchase, account, or external action is required to complete this story.

-> debrief

=== debrief ===

SESSION SUMMARY

Independent choices: {Agency}
Questions asked: {Curiosity}
Observations recorded: {Evidence}
Risk accepted: {Risk}

The numbers describe this adaptation's choices, not a measure of you.

The story ends here. The source album and its official materials remain the artists' work and the authority for its canon.

-> END
