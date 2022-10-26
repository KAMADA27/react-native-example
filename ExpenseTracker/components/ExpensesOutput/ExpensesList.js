import { FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";

function renderExpenseItem(itemData) {
  return <ExpenseItem { ...itemData.item } />;
}

function ExpensesList({expenses}) {
  return (
    <FlatList
      keyExtractor={(item) => item.id} 
      data={expenses} 
      renderItem={renderExpenseItem} 
    />
  );
}

export default ExpensesList;