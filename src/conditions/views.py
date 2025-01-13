from rest_framework import viewsets
from .models import Condition
from .serializers import ConditionSerializer


class ConditionViewSet(viewsets.ModelViewSet):
    queryset = Condition.objects.all()
    serializer_class = ConditionSerializer
