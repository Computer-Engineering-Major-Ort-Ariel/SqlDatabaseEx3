# יצירת פרוייקט חדש
פתחו את תיקיית הפרוייקטים שלכם והריצו את הפקודה הבאה (וודאו להחליף את [your project name] בשם הפרוייקט שלכם):
```
git clone https://github.com/Computer-Engineering-Major-Ort-Ariel/WebTemplate [your project name]
```

# הרצת הפרוייקט

על מנת להריץ את השרת מבלי להצטרך לפתוח את סביבת הפיתוח כמנהל, ניתן לאפשר גישה לפורט רצוי (במקרה שלנו, פורט 5000) בעזרת פתיחת שורת המשימות כמנהל והרצת הפקודה:

```
netsh http add urlacl url=http://*:5000/ user=Everyone
```
לאחר מכן נפתח את סביבת הפיתוח ונריץ את הפרוייקט בעזרת הפקודה:
```
dotnet run
```
# שמירת ושליפת מידע מה-Database

![database](https://github.com/user-attachments/assets/f1a99131-44d0-40c3-a248-1034e315def3)


# מערכת יצירת משתמש \  למשתמש
![user_system](https://github.com/user-attachments/assets/6ec4c932-cf9c-470b-9d20-6e6c4254de33)


# שמירת רשימת מידע ב-Database
הדרך האינטואיטיבית לשמירה של רשימת מידע כמו ספרים אהובים על כל משתמש או רשימת מצרכים על כל מתכון היא שימוש במערכים, אך ב-databases מסוג SQL המידע נשמר בטבלאות עם מספר שדות מוגדר לכל רשומה, לכן אנחנו לא יכולים לשמור מערכים.

## דפוס One-to-Many
במקום, נשתמש בדפוס בשם One-to-Many.
לדוגמה, אם אנחנו רוצים לאחסן מתכונים, כאשר לכל מתכון יש מצרכים משלו, נכתוב זאת בצורה כזו:

```cs
class Recipe(string name, string imageSource, string description) {
  [Key] public int Id { get; set; } = default!;
  public string Name { get; set; } = name;
  public string ImageSource { get; set; } = imageSource;
  public string description { get; set; } = description;
}

class Ingredient(int recipeId, string name, float litersAmount) {
  [Key] public int Id { get; set; } = default!;
  public string Name { get; set; } = name;
  public float LitersAmount { get; set; } = litersAmount;

  public int RecipeId { get; set; } = recipeId;
  [ForeignKey("RecipeId")] public Recipe? Recipe { get; set; } = default!;
}
```


המצרכים מאוחסנים בטבלה נפרדת, כך שמה שמקשר בין המצרך למתכון אליו הוא שייך הוא המפתח של המתכון.

שימו לב שמעבר להוספת המפתח של המתכון כשדה למצרך, אנחנו גם מגדירים אותו כמפתח זר (Foreign Key) בעזרת השורות:

סימון שדה כמפתח זר מגדירה ל-database שניתן למחוק את הרשומה באופן אוטומטי כאשר הרשומה המקורית שמחזיקה במפתח נמחקת.

## דפוס Many-to-Many
במקרה כמו איחסון רשימת ספרים מועדפים לכל משתמש, כאשר כל ספר מועדף יכול להופיע ברשימת המועדפים של מספר משתמשים, יש להשתמש בדפוס Many-to-Many:
```cs
class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}

class Book (string title, string author, string imageSource, string description, string uploaderId)
{
  [Key] public int Id { get; set; } = default!;
  public string Title { get; set; } = title;
  public string Author { get; set; } = author;
  public string ImageSource { get; set; } = imageSource;
  public string Description { get; set; } = description;
  public string UploaderId { get; set; } = uploaderId;
  [ForeignKey("UploaderId")] public User Uploader { get; set; } = default!;
}

class Favorite(string userId, int bookId)
{
  [Key] public int Id { get; set; } = default!;

  public string UserId { get; set; } = userId;
  [ForeignKey("UserId")] public User User { get; set; } = default!;

  public int BookId { get; set; } = bookId;
  [ForeignKey("BookId")] public Book Book { get; set; } = default!;
}
```
כיוון שלכל משתמש יכולים להיות מספר ספרים אהובים, ולכל ספר יכולים להיות מספר משתמשים שסימנו אותו כאהוב, עלינו להוסיף טבלה שלישית המכילה גם את המפתח של המשתמש וגם את המפתח של הספר כמפתחות זרים.
