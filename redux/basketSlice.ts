import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

export interface BasketState {
    items:Product[]
}
const initialState: BasketState = {
  items: []
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
    reducers: {

        addToBasket: (state: BasketState, action: PayloadAction<Product>) => {
            state.items = [...state.items, action.payload];
        },
        removeFromBasket: (state: BasketState, action: PayloadAction<{ id: string }>) => {
            const index = state.items.findIndex((item: Product) => item._id === action.payload.id);
            let newBasket = [...state.items];
            if (index >= 0) {
                newBasket.splice(index, 1);
            } else {
                console.log(`cant remove product(id: ${action.payload.id}) as its not in basket`);
            }
            state.items = newBasket;

        }

  },
})

// Action creators are generated for each case reducer function
export const { addToBasket, removeFromBasket } = basketSlice.actions;
//selector-> retreiving items in state to use in different components

//fetch the all items data
export const selectBasketItems = (state: RootState) => state.basket.items;

//fetch items with id
export const selectBasketItemsWithId = (state: RootState, id: string) => {
    state.basket.items.filter((item: Product) => item._id === id);
}

//calculate the basket total Amount
export const selectBasketItemsTotalAmount = (state: RootState) =>
    state.basket.items.reduce(
        (total:any,item:Product)=> (total+= item.price), 0)

export default basketSlice.reducer