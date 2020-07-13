import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  FlatList,
  Dimensions 
} from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Card';
import NumberContainer from '../components/NumberContainer';
import BodyText from '../components/BodyText';

import DefaultStyles from '../constants/default-styles';
import MainButton from '../components/MainButton';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum == exclude) {
    return generateRandomBetween(min. max, exclude);
  }

  return rndNum;
}

const renderListItem = (listLength, itemData) => (
  <View style={ styles.listItem }>
    <BodyText>#{ listLength - itemData.index }</BodyText>
    <Text>{ itemData.item }</Text>
  </View>
);

const GameScreen = props => {
  const initialGuess = generateRandomBetween(1, 99, props.useChoice) 
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);
  const currentLow = useRef(1);
  const currentHight = useRef(100);

  const { userChoice, onGameOver } = props;

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get('window').width);
      setAvailableDeviceHeight(Dimensions.get('window').height);
    };

    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

  useEffect(() => {
    if (currentGuess == userChoice ) {
      onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver])

  const nextGuessHandler = direction => {
    if (
      (direction == 'lower' && currentGuess < props.userChoice) || 
      (direction == 'greater' && currentGuess > props.userChoice)
    ) {
      Alert.alert(
        'Don\'t lie!',
        'You know that this is wrong...',
        [{ text: 'Sorry', style: 'cancel' }]
      )
      return;
    }

    if (direction == 'lower') {
      currentHight.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }

    const nextNumber = generateRandomBetween(currentLow.current, currentHight.current, currentGuess);
    setCurrentGuess(nextNumber);
    // setRounds(curRounds => curRounds + 1);
    setPastGuesses(curPastGuesses => [nextNumber.toString(), ...curPastGuesses]);
  }

  let listContainerStyle = styles.listContainer;

  if (Dimensions.get('window').width < 350) {
    listContainerStyle = styles.listContainerBig;
  }

  let gameControls = (
    <React.Fragment>
      <NumberContainer>{ currentGuess }</NumberContainer>
      <Card style={ styles.buttonContainer }>
        <MainButton onPress={ () => nextGuessHandler('lower') }>
          <Ionicons name="md-remove" size={ 24 } color="white" />
        </MainButton>
        <MainButton onPress={ () => nextGuessHandler('greater') }>
          <Ionicons name="md-add" size={ 24 } color="white" />
        </MainButton>
      </Card>
    </React.Fragment>
  )

  if (Dimensions.get('window').height < 500) {
    gameControls = (
      <View style={ styles.controls }>
        <MainButton onPress={ () => nextGuessHandler('lower') }>
          <Ionicons name="md-remove" size={ 24 } color="white" />
        </MainButton>
        <NumberContainer>{ currentGuess }</NumberContainer>
        <MainButton onPress={ () => nextGuessHandler('greater') }>
          <Ionicons name="md-add" size={ 24 } color="white" />
        </MainButton>
      </View>
    );
  }

  return (
    <View style={ styles.screen }>
      <Text style={ DefaultStyles.title }>Opponent's Guess</Text>
      { gameControls }
      <View style={ listContainerStyle }>
        {/* <ScrollView contentContainerStyle={ styles.list }>
          { pastGuesses.map((guess, index) =>  renderListItem(guess, pastGuesses.length - index)) }
        </ScrollView> */}
        <FlatList
          keyExtractor={ item => item } 
          data={ pastGuesses } 
          renderItem={ renderListItem.bind(this, pastGuesses.length) } 
          contentContainerStyle={ styles.list }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 400,
    maxWidth: '90%'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%'
  },
  listContainer: {
    flex: 1,
    width: '60%'
  },
  listContainerBig: {
    flex: 1,
    width: '80%'
  },
  list: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'flex-end'
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
})

export default GameScreen;

