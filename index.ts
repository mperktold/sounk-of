import { Source, Kind, Mode } from "sounk";

export function of<T>(...items: T[]): Source<T, Kind.Push, Mode.Sync> {
    return {
        kind: Kind.Push,
        mode: Mode.Sync,
        connect: sink => {
            let disconnected = false;
            sink.onConnect({
                message: payload => { },
                disconnect: () => disconnected = true
            });
            for (const item of items) {
                if (disconnected)
                    return;
                sink.onNext(item);
            }
            if (!disconnected)
                sink.onDisconnect();
        }
    };
}