import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Share, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { RefreshCcw, ChevronLeft, Calendar, Clock, Share2, X, MessageSquare, Tag } from 'lucide-react-native';
import { router } from 'expo-router';

type Conversation = {
  id: string;
  date: string;
  time: string;
  text: string;
  category: string;
  translation?: string;
};

export default function PastConversationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const conversations: Conversation[] = [
    {
      id: '1',
      date: '2024-03-15',
      time: '10:30 AM',
      text: 'I need to see a doctor for my headache.',
      category: 'medical',
      translation: 'Me hia me kɔ oduruyɛfo nti sɛ me ti yaw.',
    },
    {
      id: '2',
      date: '2024-03-14',
      time: '2:15 PM',
      text: 'Can you help me find the bathroom?',
      category: 'basic',
      translation: 'Wobɛtumi aboa me akɔhwehwɛ toilet no?',
    },
    {
      id: '3',
      date: '2024-03-13',
      time: '9:45 AM',
      text: 'I am feeling better today.',
      category: 'medical',
      translation: 'Me ho te sɛn yie nnɛ.',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: '📝' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'basic', label: 'Basic Needs', icon: '🍽️' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' },
  ];

  const filteredConversations = selectedFilter === 'all'
    ? conversations
    : conversations.filter(conv => conv.category === selectedFilter);

  const handleShare = async (conversation: Conversation) => {
    try {
      const message = `Date: ${conversation.date}\nTime: ${conversation.time}\n\nEnglish: ${conversation.text}\nAkan: ${conversation.translation}`;
      await Share.share({
        message,
        title: 'Shared Conversation',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical':
        return Colors.primary[500];
      case 'basic':
        return Colors.success[500];
      case 'emergency':
        return Colors.error[500];
      default:
        return Colors.gray[500];
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.primary[700]} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Conversations</Text>
        <TouchableOpacity 
          style={[styles.refreshButton, isRefreshing && styles.refreshingButton]} 
          onPress={handleRefresh}
        >
          <RefreshCcw color={Colors.primary[700]} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.selectedFilter,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.selectedFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationCard}
            onPress={() => setSelectedConversation(conversation)}
          >
            <View style={styles.conversationHeader}>
              <View style={styles.conversationInfo}>
                <View style={styles.dateTimeContainer}>
                  <Calendar size={14} color={Colors.gray[500]} />
                  <Text style={styles.dateTimeText}>{conversation.date}</Text>
                  <Clock size={14} color={Colors.gray[500]} style={styles.timeIcon} />
                  <Text style={styles.dateTimeText}>{conversation.time}</Text>
                </View>
                <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(conversation.category) + '20' }]}>
                  <Tag size={12} color={getCategoryColor(conversation.category)} />
                  <Text style={[styles.categoryText, { color: getCategoryColor(conversation.category) }]}>
                    {conversation.category.charAt(0).toUpperCase() + conversation.category.slice(1)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => handleShare(conversation)}
              >
                <Share2 size={18} color={Colors.primary[500]} />
              </TouchableOpacity>
            </View>
            <Text style={styles.conversationText} numberOfLines={1}>
              {conversation.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={selectedConversation !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedConversation(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Conversation Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedConversation(null)}
              >
                <X color={Colors.gray[500]} size={24} />
              </TouchableOpacity>
            </View>

            {selectedConversation && (
              <>
                <View style={styles.modalDateTime}>
                  <View style={styles.dateTimeItem}>
                    <Calendar size={16} color={Colors.gray[500]} />
                    <Text style={styles.dateTimeText}>{selectedConversation.date}</Text>
                  </View>
                  <View style={styles.dateTimeItem}>
                    <Clock size={16} color={Colors.gray[500]} />
                    <Text style={styles.dateTimeText}>{selectedConversation.time}</Text>
                  </View>
                </View>

                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalLabel}>English</Text>
                  <Text style={styles.modalText}>{selectedConversation.text}</Text>
                </View>

                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalLabel}>Akan</Text>
                  <Text style={styles.modalText}>{selectedConversation.translation}</Text>
                </View>

                <TouchableOpacity
                  style={styles.shareButtonLarge}
                  onPress={() => handleShare(selectedConversation)}
                >
                  <Share2 color={Colors.white} size={20} />
                  <Text style={styles.shareButtonText}>Share Conversation</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.primary[700],
  },
  refreshButton: {
    padding: 8,
  },
  refreshingButton: {
    transform: [{ rotate: '180deg' }],
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.gray[100],
  },
  selectedFilter: {
    backgroundColor: Colors.primary[500],
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.gray[600],
  },
  selectedFilterText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  conversationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeIcon: {
    marginLeft: 8,
  },
  dateTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  conversationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[900],
    lineHeight: 20,
  },
  shareButton: {
    padding: 4,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.primary[700],
  },
  closeButton: {
    padding: 8,
  },
  modalDateTime: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  modalTextContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  modalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[900],
    lineHeight: 24,
  },
  shareButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  shareButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
}); 