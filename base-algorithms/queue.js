class Queue {
    constructor(){
        this.state = {
            data: []
        }
    }
    enqueue(element) {
      this.state.data[0] = element;
    }
   isEmpty() {
     return this.state.data.length === 0;
   }
   dequeue() {
    if( this.isEmpty() === false ) {
       return this.state.data.shift(); // removes the last element
     }
   }
}