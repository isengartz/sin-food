import EventEmitter from 'events';

class InternalEventEmitter extends EventEmitter {
  emitNatsEvent() {
    this.emit('newNatsEvent');
  }
}

// export the class instance so we can use it globally
export default new InternalEventEmitter();
