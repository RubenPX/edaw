 export abstract class ReactiveClass {
  public reactIDs: { id: string, callback: () => void }[] = [];

  public onUpdate(reactID: string, callback: () => void) {
    const foundIndexClbk = this.reactIDs.findIndex(itm => itm.id == reactID);
    
    if (foundIndexClbk == -1) { // Replace if exist
      this.reactIDs.push({ id: reactID, callback });
      return;
    }

    this.reactIDs[foundIndexClbk].callback = callback;
  }

  public offUpdate(reactID: string) {
    this.reactIDs = this.reactIDs.filter(itm => itm.id != reactID);
  }

  public dispatchUpdate() {
    if (this.reactIDs.length == 0) return;
    this.reactIDs.map((itm) => itm.callback());
  }
 }