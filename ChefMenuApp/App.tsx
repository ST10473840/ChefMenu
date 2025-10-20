import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'home' | 'payment'>('splash');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (screen === 'splash') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        setScreen('home');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [screen]);

  type MenuItem = {
    dish: string;
    desc: string;
    price: string;
    course: 'Starter' | 'Main' | 'Dessert';
  };

  const [dish, setDish] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<'Starter' | 'Main' | 'Dessert'>('Starter');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState<'All' | 'Starter' | 'Main' | 'Dessert'>('All');

  const addMenuItem = () => {
    if (dish && desc && price) {
      const newItem = { dish, desc, price, course };
      setMenu([...menu, newItem]);
      setDish('');
      setDesc('');
      setPrice('');
    } else {
      Alert.alert('Please fill all fields');
    }
  };

  const filteredMenu = filter === 'All' ? menu : menu.filter((item) => item.course === filter);

  const avgPrice =
    menu.length > 0
      ? (
          menu.reduce((sum, item) => sum + parseFloat(item.price), 0) / menu.length
        ).toFixed(2)
      : 0;

  const [cardName, setCardName] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (screen === 'splash') {
    return (
      <View style={[styles.container, { backgroundColor: '#ff914d' }]}>
        <Animated.Text style={[styles.splashText, { opacity: fadeAnim }]}>
          Chef’s Menu App 🍽️
        </Animated.Text>
      </View>
    );
  }

  if (screen === 'home') {
    return (
      <View style={[styles.container, { backgroundColor: '#333' }]}>
        <Text style={styles.title}>Welcome Chef 👨🏾‍🍳</Text>

        <TextInput
          placeholder="Dish Name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={dish}
          onChangeText={setDish}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
        />
        <TextInput
          placeholder="Price"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <View style={styles.row}>
          {(['Starter', 'Main', 'Dessert'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.courseBtn, course === type && styles.activeBtn]}
              onPress={() => setCourse(type)}
            >
              <Text style={styles.btnText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addMenuItem}>
          <Text style={styles.btnText}>Add Dish</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 15 }}>
          <Text style={styles.infoText}>Total Dishes: {menu.length}</Text>
          <Text style={styles.infoText}>Average Price: R{avgPrice}</Text>
        </View>

        <View style={styles.row}>
          {(['All', 'Starter', 'Main', 'Dessert'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterBtn, filter === type && styles.activeFilter]}
              onPress={() => setFilter(type)}
            >
              <Text style={styles.btnText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredMenu}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.dish}</Text>
              <Text style={{ color: '#eee' }}>{item.desc}</Text>
              <Text style={styles.cardFooter}>
                {item.course} — R{item.price}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.addBtn, { marginTop: 20 }]}
          onPress={() => setScreen('payment')}
        >
          <Text style={styles.btnText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'payment') {
    return (
      <View style={[styles.container, { backgroundColor: '#fff' }]}>
        <Text style={[styles.title, { color: '#ff914d' }]}>Payment</Text>

        <TextInput
          placeholder="Cardholder Name"
          style={styles.payInput}
          value={cardName}
          onChangeText={setCardName}
        />
        <TextInput
          placeholder="Card Number"
          style={styles.payInput}
          keyboardType="numeric"
          value={cardNum}
          onChangeText={setCardNum}
        />
        <TextInput
          placeholder="Expiry Date (MM/YY)"
          style={styles.payInput}
          value={expiry}
          onChangeText={setExpiry}
        />
        <TextInput
          placeholder="CVV"
          style={styles.payInput}
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
        />

        <TouchableOpacity
          style={[styles.addBtn, { marginTop: 20 }]}
          onPress={() => Alert.alert('Payment Successful!')}
        >
          <Text style={styles.btnText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, { marginTop: 10, backgroundColor: '#333' }]}
          onPress={() => setScreen('splash')}
        >
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  splashText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  input: {
    width: '100%',
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  payInput: {
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  addBtn: {
    backgroundColor: '#ff914d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
    width: '100%',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  infoText: { color: '#fff', textAlign: 'center' },
  card: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#ff914d' },
  cardFooter: { color: '#ccc', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 8 },
  courseBtn: { flex: 1, marginHorizontal: 4, backgroundColor: '#555', padding: 10, borderRadius: 8 },
  activeBtn: { backgroundColor: '#ff914d' },
  filterBtn: { flex: 1, marginHorizontal: 4, backgroundColor: '#555', padding: 8, borderRadius: 8 },
  activeFilter: { backgroundColor: '#ff914d' },
});
