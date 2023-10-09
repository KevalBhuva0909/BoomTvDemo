import {
  StyleSheet,
  Text,
  Touchable,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ListData from '../Collections/ListData';
import TounamentData from '../Collections/Data';

const itemsPerPage = 10; // Number of items to load per page

const HomeScreen = () => {
  //team states
  const [MainData, setMainData] = useState(ListData);
  const [page, setPage] = useState(1);
  let [visibleData, setVisibleData] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [Tab, setTab] = useState('team');

  //tournaments states
  const [Data, setData] = useState(TounamentData);
  const [expandedCard, setExpandedCard] = useState(null);
  const [Round, setRound] = useState();
  const [Winner, setWinner] = useState();

  useEffect(() => {
    // Load initial visible data when the component mounts
    loadVisibleData();
  }, []);

  //create pairs of 2 teams group logic
  function createPairs(arr) {
    const pairs = [];

    for (let i = 0; i < arr.length; i += 2) {
      if (i + 1 < arr.length) {
        pairs.push([arr[i], arr[i + 1]]);
      } else {
        pairs.push([arr[i]]);
      }
    }

    return pairs;
  }

  //find higher score value from pair
  function findMaxObject(arr, parameter) {
    return arr.reduce((maxObj, currentObj) => {
      return currentObj[parameter] > maxObj[parameter] ? currentObj : maxObj;
    }, arr[0]);
  }

  // Function for winner tree
  const WinnerTree = item => {
    let arr = item.teams;

    let myArray = [];

    while (arr.length > 1) {
      const pairs = createPairs(arr);
      let newObj = {index: arr.length, value: pairs}; // Create a new object
      myArray.push(newObj);
      //myArray we are getting winners array of all round
      setRound(myArray);

      let x = [];

      for (let a = 0; a < pairs.length; a++) {
        const i = findMaxObject(pairs[a], 'team_score');
        x.push(i);
        arr = x;
      }
      //at last in arr we getting final winner
      setWinner(arr);
    }
  };

  //pagination load more data function
  const loadVisibleData = () => {
    setPage(page + 1);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const newVisibleData = MainData.slice(start, end);
    setVisibleData([...visibleData, ...newVisibleData]);
  };

  const MainDataRender = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.collapseButton}
        onPress={() => {
          if (expandedItem?.id == item.id) {
            setExpandedItem(null);
          } else {
            setExpandedItem(item);
          }
        }}>
        <View style={styles.subView}>
          <View>
            <Text style={styles.cardTitle}>{item?.team_name}</Text>
            <Text style={styles.scoreText}>
              {parseInt(
                item?.game1_score + item?.game2_score + item?.game3_score,
              )}{' '}
              POINTS |{' '}
              {parseInt(
                (item?.game1_score + item?.game2_score + item?.game3_score) / 3,
              )}{' '}
              AVG. POINTS
            </Text>
          </View>
          <Image
            source={require('../Assets/Icons/arrows.png')}
            style={styles.icon}
          />
        </View>
        {expandedItem?.id == item.id && (
          <View style={styles.expandedView}>
            <Text style={styles.cardTitle}>
              Game 1: <Text style={styles.scoreText}>{item?.game1_score}</Text>
            </Text>
            <Text style={styles.cardTitle}>
              Game 2: <Text style={styles.scoreText}>{item?.game2_score}</Text>
            </Text>
            <Text style={styles.cardTitle}>
              Game 3: <Text style={styles.scoreText}>{item?.game3_score}</Text>
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const TournamentRender = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.collapseButton}
        onPress={() => {
          if (expandedCard?.id == item.id) {
            setExpandedCard(null);
          } else {
            setExpandedCard(item);
            WinnerTree(item);
          }
        }}>
        <View style={styles.subView}>
          <View>
            <Text style={styles.cardTitle}>{item?.tournament_name}</Text>
            <Text style={styles.scoreText}>Date: {item.tournament_date}</Text>
          </View>
          <Image
            source={require('../Assets/Icons/arrows.png')}
            style={styles.icon}
          />
        </View>
        {expandedCard?.id == item.id && (
          <View style={styles.expandedView}>
            <Text style={styles.cardTitle}>Round 1:</Text>
            {item?.teams.map((item, index) => {
              return (
                <>
                  <Text style={{paddingBottom: index % 2 == 1 ? 5 : 0}}>
                    {item?.team_name} : {item?.team_score}
                  </Text>
                </>
              );
            })}
            <Text style={styles.cardTitle}>Round 2:</Text>
            {Round[1].value.map(item => {
              return item.map((item, index) => {
                return (
                  <>
                    <Text style={{paddingBottom: index % 2 == 1 ? 5 : 0}}>
                      {item?.team_name} : {item?.team_score}
                    </Text>
                  </>
                );
              });
            })}
            <Text style={styles.cardTitle}>Round 3:</Text>
            {Round[2].value.map(item => {
              return item.map((item, index) => {
                return (
                  <>
                    <Text style={{paddingBottom: index % 2 == 1 ? 5 : 0}}>
                      {item?.team_name} : {item?.team_score}
                    </Text>
                  </>
                );
              });
            })}
            <Text style={styles.cardTitle}>Winner:</Text>
            <Text>{Winner[0]?.team_name}</Text>
            <Text>Score : {Winner[0]?.team_score} POINTS</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.tabView}>
        <TouchableOpacity style={styles.button} onPress={() => setTab('team')}>
          <Text style={styles.buttonText}>Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTab('tournament')}>
          <Text style={styles.buttonText}>Tournaments</Text>
        </TouchableOpacity>
      </View>

      {Tab == 'team' ? (
        <FlatList
          data={visibleData}
          renderItem={MainDataRender}
          ItemSeparatorComponent={() => {
            return <View style={{marginVertical: 10}} />;
          }}
          onEndReached={() => {
            // Load more data when the user reaches the end of the list
            if (MainData.length > visibleData.length) {
              loadVisibleData();
            }
          }}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{paddingBottom: 40}}
        />
      ) : (
        <FlatList
          data={Data}
          renderItem={TournamentRender}
          ItemSeparatorComponent={() => {
            return <View style={{marginVertical: 10}} />;
          }}
          contentContainerStyle={{paddingBottom: 40}}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFC594',
    paddingTop: 40,
  },
  tabView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  button: {
    width: '49%',
    backgroundColor: '#fc7f03',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  title: {
    fontSize: 35,
    color: 'black',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 30,
  },
  collapseButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: '400',
    paddingTop: 5,
  },
  icon: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  expandedView: {
    paddingTop: 10,
  },
});
