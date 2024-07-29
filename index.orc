
sr = 48000
ksmps = 32
nchnls = 6
0dbfs = 1

instr 13, beat

iRate init 1 / abs ( p3 )
p3 *= 1000
SNote strget p4
strset p5, SNote

kLoop metro iRate

if kLoop == 1 then

schedulek 9 + frac ( p1 ), 0, 1, p5, p6, p7

endif

endin

instr 9, playback

SNote strget p4
p3 filelen SNote

aLeft, aRight diskin2 SNote

outs aLeft / ( p5 + 1 ), aRight / ( p6 + 1 )

endin

instr 4, record

SPath strget p4
SPath1 strcat SPath, "_1.wav"
SPath2 strcat SPath, "_2.wav"
SPath3 strcat SPath, "_3.wav"

aLeft1, aRight1 inch 1, 2
aLeft2, aRight2 inch 3, 4
aLeft3, aRight3 inch 5, 6

fout SPath1, -1, aLeft1, aRight1
fout SPath2, -1, aLeft2, aRight2
fout SPath3, -1, aLeft3, aRight3

endin
