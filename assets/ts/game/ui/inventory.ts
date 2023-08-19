import {$, $$, $$Opts, logError} from "../../lib/util";
import {imageImports} from "../../window";

class Inventory {
  public rows: number;
  public columns: number;
  public slotsAmount: number;
  
  constructor(o: {
    rows: number;
    columns: number;
    slotsAmount: number;
  }) {
    this.rows = o.rows;
    this.columns = o.columns;
    
    if(o.slotsAmount > o.rows * o.columns) {
      o.slotsAmount = o.rows * o.columns;
      
      logError(
        `inventory.ts: "slotsAmount" can't be greater `
      + `than the rows multiplied by the columns`
      );
    }
    
    this.slotsAmount = o.slotsAmount;
    
    return this;
  }
}
