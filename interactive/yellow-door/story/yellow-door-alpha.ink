// Reconstructed / expanded Inpatient Corridors alpha.
// Canonical Ink source for the Yellow Door interactive.
// Source basis: user-supplied alpha draft and subsequent design revisions.
// This is not a recovered historical source file.

VAR SystemPressure = 5
VAR Support = 0
VAR Resistance = 0
VAR Knowledge = 0
VAR Trust = 0
VAR Participation = 0
VAR Insight = 0
VAR Investigated = false
VAR Observed = false
VAR SupportedPerson = false
VAR ChallengedAuthority = false
VAR MidpointRevealSeen = false

-> start

=== start ===
The yellow door wasn't special yesterday.

At least, you don't remember it being special.

The paint is chipped near the handle.

Someone scratched a small mark near the frame.

A circle.

Crossed once.

Crossed again.

The mark means something to someone.

You don't know who.

The handwritten notice hangs slightly crooked.

No one fixes it.

No one removes it.

No one explains it.

Three people stand nearby.

Mara stares at the floor.

Jules folds their arms.

Pat watches the door.

Nobody speaks.

What do you do?

+ Ask what happened.
    -> ask_group
+ Read the notice more carefully.
    -> inspect_notice
+ Watch people instead of approaching them.
    -> witness
+ Check on Mara instead of discussing the door.
    -> caretaker
+ Ignore it and continue down the corridor.
    -> walk_away

=== ask_group ===
You ask what happened.

Jules laughs once.

"Depends who you ask."

Mara finally looks up.

"They moved someone."

Pat shakes their head.

"That's not the point."

Nobody agrees on what happened.

Everybody agrees something changed.

+ Ask for details.
    -> details
+ Ask what people want to do.
    -> next_steps
+ Leave the conversation.
    -> walk_away

=== details ===
Mara speaks quietly.

"No one asked us."

Pat nods.

"They made the decision and posted a sign."

Jules shrugs.

"Maybe there was a reason."

The conversation seems less about the room and more about whether people deserve explanations.

~ Resistance += 1
~ Knowledge += 1

-> next_steps

=== next_steps ===
Pat wants to challenge the decision.

Jules wants more information first.

Mara wants support before doing anything.

What sounds right to you?

+ Gather information.
    -> info_path
+ Seek support.
    -> support_path
+ Challenge the decision immediately.
    -> challenge_path

=== inspect_notice ===
You examine the paper.

The message is short.

Too short.

The edges suggest it was printed recently.

No reason.

No contact information.

No process.

The lack of information creates its own pressure.

~ SystemPressure += 1
~ Knowledge += 1

+ Knock on the yellow door.
    -> knock
+ Look for staff.
    -> info_path
+ Return to the group.
    -> ask_group

=== witness ===
You stay near the wall.

Nobody notices.

Or perhaps they do.

People move differently around the yellow door.

A worker carrying supplies takes a longer route.

A visitor slows down without realizing it.

A resident pauses, then keeps walking.

The door changes behavior even when nobody talks about it.

~ Knowledge += 2
~ Participation += 1
~ Observed = true
~ Insight += 1

What do you focus on?

+ The people avoiding the door.
    -> avoidance
+ The people stopping near it.
    -> curiosity
+ The patterns themselves.
    -> systems_view

=== avoidance ===
You notice how quickly people learn to route around something unexplained.

Nobody announces the new path.

It simply becomes normal.

+ Talk to someone who avoids it.
    -> rumor
+ Return to the group.
    -> ask_group

=== curiosity ===
A few people stop near the door, look at the notice, and move on.

Curiosity is easier to see than agreement.

+ Ask one of them what they heard.
    -> rumor
+ Look for older notices.
    -> archive

=== systems_view ===
You begin noticing the pattern rather than the incident.

A notice changes movement.

Movement changes who meets whom.

Silence changes what people assume.

~ Insight += 1
-> archive

=== caretaker ===
You sit beside Mara.

The conversation continues without you.

For a while neither of you speaks.

Eventually she says:

"I don't actually care about the room."

You wait.

She continues.

"I care that nobody told us."

The distinction matters.

The room is a symptom.

The exclusion is the wound.

~ Support += 2
~ Trust += 1
~ SupportedPerson = true
~ Insight += 1

+ Encourage her to speak in the meeting.
    -> empower
+ Offer to speak with her privately later.
    -> quiet_support

=== empower ===
Mara takes a breath.

"If I say it, will anyone listen?"

You tell her the answer should not depend on being the loudest person in the room.

~ Participation += 1
-> next_steps

=== quiet_support ===
You tell Mara she does not have to perform certainty to deserve an explanation.

She nods.

The yellow door remains closed.

The conversation around it changes anyway.

-> next_steps

=== info_path ===
You decide facts come first.

You ask who made the decision.

You ask why.

You ask whether alternatives were considered.

Some answers are available.

Some are not.

But uncertainty becomes smaller.

~ SystemPressure -= 1
~ Knowledge += 2
~ Investigated = true
~ Insight += 1

+ Search old notices.
    -> archive
+ Ask around anonymously.
    -> rumor
+ Share information with others.
    -> collective_action
+ Keep investigating alone.
    -> solo_path

=== archive ===
You find older notices.

Different rooms.

Different dates.

Different explanations.

The wording changes.

The pattern does not.

You learn this is not the first yellow door.

Only the latest one.

~ Knowledge += 3
~ SystemPressure -= 1
~ Investigated = true
~ Insight += 2

+ Bring the history to the group.
    -> collective_action
+ Keep reading.
    -> midpoint_reveal

=== rumor ===
You ask around without saying exactly why.

One person says the restriction is about safety.

Another says it is punishment.

Someone else says it was simply convenient.

No version matches completely.

Information can reduce uncertainty.

It can also create more of it.

~ SystemPressure += 1
~ Trust -= 1
~ Knowledge += 1

+ Check what can actually be verified.
    -> info_path
+ Bring the conflicting accounts to the group.
    -> midpoint_reveal

=== support_path ===
You suggest gathering people before taking action.

Mara relaxes slightly.

Pat seems impatient.

Still, both agree to meet together.

The conversation grows.

Questions appear.

Ideas appear.

Nobody has answers yet.

But nobody stands alone.

~ Support += 2
~ SystemPressure -= 1
~ Trust += 1
~ Participation += 1

+ Develop shared questions.
    -> collective_action
+ Ask Mara what she needs.
    -> quiet_support

=== challenge_path ===
You walk directly to the office responsible for the notice.

Your questions are clear.

Your frustration is visible.

Some people admire the directness.

Others worry the conversation may end before it begins.

~ Resistance += 2
~ Participation += 2
~ ChallengedAuthority = true
~ SystemPressure += 1

+ Continue alone.
    -> solo_path
+ Invite others into the discussion.
    -> collective_action
+ Ask for the decision process.
    -> midpoint_reveal

=== knock ===
You knock.

Nothing.

A second knock.

Nothing.

The silence feels important.

Not because it provides an answer.

Because it reminds everyone how little information exists.

~ SystemPressure += 1

+ Seek support.
    -> support_path
+ Seek information.
    -> info_path

=== midpoint_reveal ===
~ MidpointRevealSeen = true

The explanation finally appears.

The restriction is temporary.

The stated reason is legitimate enough.

No hidden villain steps forward.

The question changes.

The problem was never simply the door.

The problem was the process.

+ Accept the explanation.
    ~ Trust += 1
    -> collective_action
+ Ask why people weren't informed.
    ~ Resistance += 1
    ~ Knowledge += 1
    -> collective_action
+ Ask how future decisions will be handled.
    ~ Participation += 2
    ~ Trust += 1
    -> collective_action

=== collective_action ===
A small meeting forms.

Different opinions remain.

Nobody agrees on everything.

Still, people identify three shared goals:

Understand the decision.
Request transparency.
Ensure future changes include input from those affected.

The discussion does not solve everything.

But it creates a process.

And a process reduces uncertainty.

~ Support += 2
~ Participation += 1
~ SystemPressure -= 2
~ Trust += 1

-> determine_ending

=== solo_path ===
You continue independently.

You gather information.

You raise concerns.

You push for answers.

Progress happens.

Slowly.

But every task belongs to you.

The effort becomes exhausting.

~ SystemPressure += 2
~ Knowledge += 1

-> determine_ending

=== walk_away ===
You continue down the corridor.

The yellow door disappears behind you.

For a moment, everything feels simpler.

Then a question follows.

If nobody asks why something happened, does the decision become permanent?

You stop.

+ Keep walking.
    -> ending_alone
+ Turn back.
    -> ask_group

=== ending_alone ===
The corridor continues.

Life continues.

The yellow door remains closed.

You never discover what happened.

Sometimes avoiding conflict protects your energy.

Sometimes it leaves questions unanswered.

-> determine_ending

=== determine_ending ===
{
- Support >= 3 && Resistance >= 2 && Knowledge >= 3 && Participation >= 5 && Trust >= 2:
    -> ending_community
- Support >= 4 && Support >= Resistance + 1 && Support >= Knowledge:
    -> ending_caretaker
- Resistance >= 4 && Resistance > Support:
    -> ending_instigator
- Knowledge >= 5 && Investigated == true && Knowledge > Support:
    -> ending_researcher
- Participation >= 5 && Trust >= 3:
    -> ending_builder
- else:
    -> ending_observer
}

=== ending_community ===
Weeks later, the yellow door is no longer remarkable.

People barely notice it.

What they notice instead is the new process.

Questions are asked earlier.

Explanations arrive sooner.

Disagreement still exists.

But participation has become ordinary.

The corridor did not become perfect.

It became shared.

You helped make that possible.

-> pressure_epilogue

=== ending_caretaker ===
Most people remember the meeting.

Mara remembers something else.

Someone sat beside her.

Someone listened.

The official policy changed only slightly.

The human experience changed much more.

Support became its own form of action.

-> pressure_epilogue

=== ending_instigator ===
The issue refused to disappear.

Questions became discussions.

Discussions became pressure.

Pressure forced attention.

Not everyone approved of your approach.

Not everyone needed to.

The system responded.

Change rarely begins quietly.

-> pressure_epilogue

=== ending_researcher ===
The archive reveals something unexpected.

The yellow door is just one example.

Different years.

Different notices.

Different explanations.

The same patterns appear again and again.

You leave with more questions than answers.

Strangely, that feels like progress.

-> pressure_epilogue

=== ending_builder ===
The solution was not a single decision.

The solution was infrastructure.

Notice boards.

Meetings.

Shared channels.

Places where concerns could exist before becoming crises.

The yellow door reopened.

The new process remained.

-> pressure_epilogue

=== ending_observer ===
The notice eventually disappears.

Life continues.

The hallway returns to normal.

You understand more than when you started.

What happened.

Why it happened.

How people reacted.

The system moved forward.

Without you.

Not every lesson becomes action.

-> pressure_epilogue

=== pressure_epilogue ===
{
- SystemPressure <= 2:
    The atmosphere feels lighter.
    People ask questions more freely.
- SystemPressure <= 6:
    Some uncertainty remains.
    Old habits fade slowly.
- else:
    The tension never fully leaves.
    The next yellow door may not be far away.
}

-> final_debrief

=== final_debrief ===
SYSTEM PRESSURE: {SystemPressure}
SUPPORT: {Support}
RESISTANCE: {Resistance}
KNOWLEDGE: {Knowledge}
TRUST: {Trust}
PARTICIPATION: {Participation}

-> archetype

=== archetype ===
{
- Support > Resistance && Support > Knowledge:
    You approached the corridor primarily through relationships.
- Resistance > Support && Resistance > Knowledge:
    You approached the corridor primarily through challenge.
- Knowledge > Resistance && Knowledge > Support:
    You approached the corridor primarily through investigation.
- else:
    You approached the corridor through several modes.
}

The yellow door is gone.

What remains?

+ Being heard.
    -> THE_END
+ Understanding why.
    -> THE_END
+ Helping others.
    -> THE_END
+ Challenging decisions.
    -> THE_END
+ Building trust.
    -> THE_END

=== THE_END ===
Thank you for participating.
-> END
