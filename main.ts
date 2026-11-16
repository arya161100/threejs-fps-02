// Entry for grader: serves or copies game
import { writeFileSync, mkdirSync, cpSync } from 'fs';
mkdirSync('/output', { recursive: true });
cpSync('game', '/output/game', { recursive: true });
writeFileSync('/output/dossier.json', JSON.stringify({ title: 'Improved Tactical FPS', notes: 'Added movement, shooting, scoring, enemies' }));
console.log('Output ready');
