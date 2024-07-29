
import Scenarist from '@faddys/scenarist';
import { readFile } from 'node:fs/promises';

await Scenarist ( new class extends Array {

async $_producer ( $ ) {

try {

const notation = await readFile ( process .argv .slice ( 2 ) .shift () || 'examples/scratch.no', 'utf8' );

for ( let line of notation .trim () .split ( '\n' ) )
if ( ( line = line .trim () ) .length )
await $ ( ... line .split ( /\s+/ ) );

await $ ( '|' );

console .log ( this .map ( note => ( typeof note === 'object' ? this .note ( note ) : note ) ) .join ( '\n' ) );

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
`"equipment/${ sound }.wav"`,
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
