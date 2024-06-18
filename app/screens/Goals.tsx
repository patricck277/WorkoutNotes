import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';

type Goal = {
  id: string;
  name: string;
  description: string;
  targetDate: string;
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalName, setGoalName] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');

  const fetchGoals = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const userGoalsQuery = query(
      collection(FIRESTORE_DB, 'userGoals'),
      where('userId', '==', userUid)
    );
    const userGoalsSnapshot = await getDocs(userGoalsQuery);

    const goalIds = userGoalsSnapshot.docs.map((doc) => doc.data().goalId);
    const fetchedGoals: Goal[] = [];

    for (const goalId of goalIds) {
      const goalDoc = await getDoc(doc(FIRESTORE_DB, 'goals', goalId));
      if (goalDoc.exists()) {
        fetchedGoals.push({ id: goalDoc.id, ...goalDoc.data() } as Goal);
      }
    }

    setGoals(fetchedGoals);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    try {
      const goalDoc = await addDoc(collection(FIRESTORE_DB, 'goals'), {
        name: goalName,
        description: goalDescription,
        targetDate: goalTargetDate,
      });

      await addDoc(collection(FIRESTORE_DB, 'userGoals'), {
        userId: userUid,
        goalId: goalDoc.id,
      });

      setGoals([
        ...goals,
        {
          id: goalDoc.id,
          name: goalName,
          description: goalDescription,
          targetDate: goalTargetDate,
        },
      ]);
      setGoalName('');
      setGoalDescription('');
      setGoalTargetDate('');
    } catch (error) {
      console.error('Error adding goal: ', error);
    }
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <View style={styles.goalContainer}>
      <Text style={styles.goalText}>{item.name}</Text>
      <Text style={styles.goalDescription}>{item.description}</Text>
      <Text style={styles.goalDate}>{item.targetDate}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.goalTitle}>Goals</Text>
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          style={styles.goalList}
          contentContainerStyle={styles.goalListContent}
        />
        <TextInput
          placeholder="Goal Name"
          value={goalName}
          onChangeText={setGoalName}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Goal Description"
          value={goalDescription}
          onChangeText={setGoalDescription}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Target Date (YYYY-MM-DD)"
          value={goalTargetDate}
          onChangeText={setGoalTargetDate}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Text style={styles.buttonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 20,
  },
  goalList: {
    width: '100%',
  },
  goalListContent: {
    paddingBottom: 20,
  },
  goalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  goalText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  goalDescription: {
    fontSize: 16,
    color: 'white',
  },
  goalDate: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Goals;
