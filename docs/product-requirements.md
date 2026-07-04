# Product Requirements

## Ürün Tanımı

Bereket AI, kullanıcının evdeki mevcut malzemelerini, kişi sayısını, haftalık bütçesini ve gıdaların bozulma riskini dikkate alarak düşük maliyetli ve israfı azaltan yemek planı öneren mutfak planlama uygulamasıdır.

## Problem

Kullanıcılar evde hangi malzemelerin olduğunu, bu malzemelerle ne pişirebileceğini, ne kadar ek alışveriş gerektiğini ve bütçesini aşıp aşmayacağını tek bir yerden planlayamıyor. Bu durum karar yorgunluğu, gıda israfı ve gereksiz harcamaya yol açıyor.

## Sprint 1 Çözümü

Sprint 1 prototipi, ChatGPT tarzı bir sohbet arayüzü üzerinden kullanıcıdan malzeme ve bütçe bilgisini alıyormuş gibi davranır. Kullanıcının yazdığı mesaj veya seçtiği hazır prompt, sabit (mock) bir yemek planı cevabıyla yanıtlanır. Amaç ürün fikrini uçtan uca akan bir prototip üzerinde göstermektir; gerçek AI veya canlı veri kullanılmaz.

## Temel Kullanıcı Akışı

1. Kullanıcı Bereket AI prototipini açar (varsayılan karanlık tema ile).
2. Hazır demo promptlarından birini seçer veya kendi mesajını yazar.
3. Sistem, cevap hazırlanırken kısa bir "düşünme" animasyonu gösterir.
4. Asistan cevabı harf harf akar; altında 5 günlük yemek planı, eksik alışveriş listesi, tahmini maliyet, "neden bu plan?" açıklaması ve üç skor (bütçe/israf/kiler) içeren bir özet paneli ile Recharts grafiği belirir.
5. İstendiğinde header'daki tema değiştirici ile aydınlık/karanlık tema, çöp ikonu üzerinden açılan onay penceresi ile de sohbet temizleme kullanılabilir.

## Başarı Ölçütleri

- Ürün fikri 1 dakikalık demo içinde anlaşılır.
- Kullanıcı mevcut malzeme, bütçe, israf ve alışveriş maliyeti ilişkisini aynı ekranda görebilir.
- Sprint 1 prototipinin gerçek veri veya AI entegrasyonu olmadığı arayüzde açıkça belirtilir.
