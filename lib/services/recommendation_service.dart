import '../models/recommendation.dart';

abstract interface class RecommendationService {
  Future<RecommendationBatch> recommend(RecommendationRequest request);
}
