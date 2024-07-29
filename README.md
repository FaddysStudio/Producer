#!/usr/bin/env roll

# Faddy's Music Producer

Work of Faddy Michel

In Solidarity with The People of Palestine till Their Whole Land is FREE

## Prerequisites

* [Node.js](https://nodejs.org)
* [npm](https://npmjs.org)
* [Csound](https://csound.com)

## Installation

```sh
sudo npm i -g @faddys/producer
```

## Usage

```sh
producer [ notation ]
```

## `.FaddysProducer`

```roll
?# if [ ! -d .FaddysProducer ] ; then mkdir .FaddysProducer ; fi
```

## `.FaddysProducer/examples/`

```roll
?# cd .FaddysProducer ; if [ ! -d examples ] ; then mkdir examples ; fi
```

### `.FaddysProducer/examples/maqsum.no`

```roll
?# cd .FaddysProducer/examples ; cat - > maqsum.no
```

```
+==

~ 105 4

0/8 dom/01 1/8 tak/04 3/8 tak/07 4/8 dom/12 6/8 tak/06

-==
```

### `.FaddysProducer/index.orc`

```roll
?# cd .FaddysProducer ; if [ ! -f index.orc ] ; then cat - > index.orc ; fi
```

```csound
//+==

sr = 48000
ksmps = 32
nchnls = 6
0dbfs = 1

instr 13, 14, beat

p3 *= 1000
SPath strget p4
strset p5, SPath

iEvent init ( int ( p1 ) % 10 ) + frac ( p1 )

kLoop metro 1/p3

if kLoop == 1 then

schedulek iEvent, 0, 1, p5, p6, p7

endif

endin

instr 3, playback

SPath strget p4
p3 filelen SPath

aLeft, aRight diskin2 SPath

outs aLeft / ( p5 + 1 ), aRight / ( p6 + 1 )

endin

instr 4, recorder

SPath strget p4

SPath1 strcat SPath, ".1.2.wav"
SPath2 strcat SPath, ".3.4.wav"
SPath3 strcat SPath, ".5.6.wav"

aLeft1, aRight1 inch 1, 2
aLeft2, aRight2 inch 3, 4
aLeft3, aRight3 inch 5, 6

fout SPath1, -1, aLeft1, aRight1
fout SPath2, -1, aLeft2, aRight2
fout SPath3, -1, aLeft3, aRight3

endin

//-==
```

### `.FaddysProducer/node_modules/@faddys/scenarist`

```roll
?# cd .FaddysProducer ; if [ ! -d node_modules/@faddys/scenarist ] ; then npm i @faddys/scenarist ; fi
```

### `.FaddysProducer/node_modules/@faddys/command`

```roll
?# cd .FaddysProducer ; if [ ! -d node_modules/@faddys/command ] ; then npm i @faddys/command ; fi
```

### `.FaddysProducer/score.mjs`

```roll
?# cat - > .FaddysProducer/score.mjs
```

```js
//+==

import Scenarist from '@faddys/scenarist';
import $0 from '@faddys/command';

await Scenarist ( new class extends Array {

async $_producer ( $ ) {

try {

const directory = this .directory = await $0 ( 'producer-directory' )
.then ( $ => $ ( Symbol .for ( 'output' ) ) )
.then ( ( [ directory ] ) => directory );
const argv = process .argv .slice ( 2 );

if ( argv .length ) {

const notation = await $0 ( 'cat', argv .shift () )
.then ( async $ => ( {

output: await $ ( Symbol .for ( 'output' ) ),
error: await $ ( Symbol .for ( 'error' ) )

} ) );

if ( notation .error .length )
throw notation .error .join ( '\n' );

for ( let line of notation .output )
if ( ( line = line .trim () ) .length )
await $ ( ... line .split ( /\s+/ ) );

await $ ( '|' );

console .log ( this .map ( note => ( typeof note === 'object' ? this .note ( note ) : note ) ) .join ( '\n' ) );

}

} catch ( error ) {

console .error ( '#error', error ?.message || error );

}

}

[ '$~' ] ( $, tempo, bar, ... argv ) {

this .push ( `t 0 ${ this .tempo = tempo }`,
`v ${ this .bar = bar }` );

return $ ( ... argv );

}

time = 0;

[ '$|' ] ( $, ... argv ) {

return this .push ( `b ${ ++this .time * this .bar }` ), $ ( ... argv );

}

$$ ( $, label, ... argv ) {

this .label = label;
this [ label ] = [];
this [ '$' + label ] = ( $, ... argv ) => {

this .push ( ... this [ label ] );

return $ ( ... argv );

};

return $ ( ... argv );

}

left = 3;
right =3;

[ '$=' ] ( $, left, right, ... argv ) {

Object .assign ( this, { left, right } );

return $ ( ... argv );

}

#instance = 0
instance () { return ++this .#instance % 10 === 0 ? ++this .#instance : this .#instance }

$_director ( $, ... argv ) {

if ( ! argv .length )
return this .label;

const [ step, divisions ] = argv .shift () .split ( '/' );
const sound = argv .shift ();
const { time } = this;
const note = { step, divisions, sound, time };

this .push ( note );

if ( this .label ?.length )
this [ this .label ] .push ( note );

return $ ( ... argv );

}

note ( { step, divisions, sound, time } ) {

const instance = this .instance ();

return [

'i',
`13.${ instance }`,
`[${ step }/${ divisions }]`,
time === this .time - 1 ? this .time : -this .time,
`"${ this .directory }/equipment/${ sound }.wav"`,
instance,
this .left,
this .right

] .join ( ' ' );

}

record = {}

 $o ( $, path ) {

this .push ( `i 4.${ this .record [ path ] = this .instance () } 0 -1 "${ path }"` );

}

} );

//-==
```

```roll
?# $ node .FaddysProducer/score.mjs > .FaddysProducer/index.sco
```

```roll
?# -1 -2 csound -iadc -odac .FaddysProducer/index.*
```
