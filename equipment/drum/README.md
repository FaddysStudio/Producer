# Faddy's Drum Kick Synthesizer

?# if [ ! -d node_modules/@faddys/scenarist ]; then npm i @faddys/scenarist ; fi

?# cat - > index.orc

+==

sr = 48000
ksmps = 32
nchnls = 2
0dbfs = 1

giStrikeFT ftgen 0, 0, 256, 1, "../prerequisites/marmstk1.wav", 0, 0, 0
giVibratoFT ftgen 0, 0, 128, 10, 1

#define p #p ( iIndex )
iIndex += 1#

instr 1, sub

pset 1, 0, 1, 5, 1/32, 1/8, 1/4, 1/2

iIndex init 4

iAttack init $p
iDecay init $p
iRelease init $p

p3 init iAttack + iDecay + iRelease

aAmplitude linseg 0, iAttack, iAmplitudeAttack, iDecay, iAmplitudeSustain, iRelease, iAmplitudeRelease
aFrequency linseg cpsoct ( iOctaveInitial ), iAttack, cpsoct ( iOctaveAttack ), iDecay, i

a poscil aAmplitude, aFrequency

aNote += a

aHighSubAmplitude linseg 0, iAttack/8, 1, iDecay/8, .25, iRelease/8, 0
aHighSubFrequency linseg cpsoct ( 10 + iPitch ), iAttack/2, cpsoct ( 7 + iPitch )

aHighSub poscil aHighSubAmplitude, aHighSubFrequency

aNote += aHighSub / 8

aGogobell gogobel 1, cpsoct ( 5 + iPitch ), .5, .5, giStrikeFT, 6.0, 0.3, giVibratoFT

aNote += aGogobell / 4

aSnatchAmplitude linseg 0, iAttack/8, 1, iDecay/8, 0
aSnatchFrequency linseg cpsoct ( 10 + iPitch ), iAttack/2, cpsoct ( 9 + iPitch )

aSnatch noise aSnatchAmplitude, 0
aSnatch butterlp aSnatch, aSnatchFrequency

aNote += aSnatch*4

aNote clip aNote, 1, 1

outs aNote, aNote

endin

-==

?# cat - > index.mjs

+==

import Scenarist from '@faddys/scenarist';

await Scenarist ( new class {

$_producer ( $ ) {

const dom = this;

dom .degrees = parseInt ( process .argv .slice ( 2 ) .pop () ) || 24;

dom .prepare ();

}

prepare () {

const dom = this;

for ( let step = 0; step < dom .degrees; step++ ) {

let index = ( step / 100 ) .toString () .slice ( 2 );

index += '0' .repeat ( 2 - index .length );

let score = `sco/${ index }.sco`;
let audio = `audio/${ index }.wav`;

console .log ( [

`echo "i 13 0 1 ${ step } ${ dom .degrees }" > ${ score }`,
`csound -o ${ audio } index.orc ${ score }`,
`aplay ${ audio }`

] .join ( ' ; ' ) );

}

}

} );

-==

?# rm -fr index.sh sco audio ; mkdir sco audio
?# node ./index.mjs >> index.sh

?# bash index.sh
