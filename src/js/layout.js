/**
 * Layout & Section Reordering Manager
 */

export class LayoutManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  // Menukar posisi section ke atas
  moveUp(sectionKey) {
    const state = this.stateManager.getState();
    const order = [...state.sectionOrder];
    const index = order.indexOf(sectionKey);

    if (index > 0) {
      [order[index - 1], order[index]] = [order[index], order[index - 1]];
      this.stateManager.setState({ sectionOrder: order });
    }
  }

  // Menukar posisi section ke bawah
  moveDown(sectionKey) {
    const state = this.stateManager.getState();
    const order = [...state.sectionOrder];
    const index = order.indexOf(sectionKey);

    if (index !== -1 && index < order.length - 1) {
      [order[index], order[index + 1]] = [order[index + 1], order[index]];
      this.stateManager.setState({ sectionOrder: order });
    }
  }
}