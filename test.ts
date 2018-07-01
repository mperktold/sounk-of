import { of } from './index';
import test from 'tape';
import { Sink, Connection } from 'sounk';

test('it should create a listenable source of given items', t => {
    t.plan(2);
    let connection: Connection | null = null;
    const items: string[] = [];
    of('first', 'second', 'third').connect({
        onConnect: c => connection = c,
        onNext: item => items.push(item),
        onDisconnect: error => {
            t.equal(items.length, 3);
            t.deepEquals(items, ['first', 'second', 'third']);
            t.end();
        }
    });
});

test('it should stop emitting items on disconnect', t => {
    t.plan(2);
    let connection: Connection | null = null;
    const items: string[] = [];
    of('first', 'second', 'third').connect({
        onConnect: c => connection = c,
        onNext: item => {
            items.push(item);
            connection!.disconnect();
        },
        onDisconnect: error => {
            t.fail('it should not call onDisconnect');
        }
    });
    t.equal(items.length, 1);
    t.deepEquals(items[0], 'first');
    t.end();
});

test('it should never emit items when disconnected inside onConnect', t => {
    t.plan(1);
    const items: string[] = [];
    of('first', 'second', 'third').connect({
        onConnect: connection => connection.disconnect(),
        onNext: item => items.push(item),
        onDisconnect: error => {
            t.fail('it should not call onDisconnect');
        }
    });
    t.equal(items.length, 0);
    t.end();
});