
class State<T> {
    private _value: T
    private _next: T | null;
    private _boundElements: Map<any, (newValue: T, oldValue: T) => void> = new Map();

    constructor(value: T) {
        this._value = value;
        this._next = null;
    }

    get value() {
        return this._value;
    }

    update(value: T) {
        this._next = value;
        this._onUpdate();
    }

    _onUpdate() {
        if (this._next !== null) {
            this._value = this._next;
            this._boundElements.forEach(fun => fun(this._value, this._next!));
            this._next = null;
        }
    }

    bind(hash: any, onUpdate: (newValue: T, oldValue: T) => void) {
        this._boundElements.set(hash, onUpdate);
    }
    removeBinding(hash: any) {
        this._boundElements.delete(hash);
    }
}

export default State;