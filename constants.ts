

import { Finger, KeyConfig, Lesson } from './types';

// Keyboard Layout (Simplified QWERTY mapping for visuals)
export const KEYBOARD_ROWS: KeyConfig[][] = [
  [
    { char: '`', finger: Finger.LeftPinky },
    { char: '1', finger: Finger.LeftPinky },
    { char: '2', finger: Finger.LeftRing },
    { char: '3', finger: Finger.LeftMiddle },
    { char: '4', finger: Finger.LeftIndex },
    { char: '5', finger: Finger.LeftIndex },
    { char: '6', finger: Finger.RightIndex },
    { char: '7', finger: Finger.RightIndex },
    { char: '8', finger: Finger.RightMiddle },
    { char: '9', finger: Finger.RightRing },
    { char: '0', finger: Finger.RightPinky },
    { char: '-', finger: Finger.RightPinky },
    { char: '=', finger: Finger.RightPinky },
    { char: 'Backspace', finger: Finger.RightPinky, width: 2, code: 'Backspace' },
  ],
  [
    { char: 'Tab', finger: Finger.LeftPinky, width: 1.5, code: 'Tab' },
    { char: 'q', finger: Finger.LeftPinky },
    { char: 'w', finger: Finger.LeftRing },
    { char: 'e', finger: Finger.LeftMiddle },
    { char: 'r', finger: Finger.LeftIndex },
    { char: 't', finger: Finger.LeftIndex },
    { char: 'y', finger: Finger.RightIndex },
    { char: 'u', finger: Finger.RightIndex },
    { char: 'i', finger: Finger.RightMiddle },
    { char: 'o', finger: Finger.RightRing },
    { char: 'p', finger: Finger.RightPinky },
    { char: '[', finger: Finger.RightPinky },
    { char: ']', finger: Finger.RightPinky },
    { char: '\\', finger: Finger.RightPinky },
  ],
  [
    { char: 'Caps', finger: Finger.LeftPinky, width: 1.8, code: 'CapsLock' },
    { char: 'a', finger: Finger.LeftPinky },
    { char: 's', finger: Finger.LeftRing },
    { char: 'd', finger: Finger.LeftMiddle },
    { char: 'f', finger: Finger.LeftIndex },
    { char: 'g', finger: Finger.LeftIndex },
    { char: 'h', finger: Finger.RightIndex },
    { char: 'j', finger: Finger.RightIndex },
    { char: 'k', finger: Finger.RightMiddle },
    { char: 'l', finger: Finger.RightRing },
    { char: ';', finger: Finger.RightPinky },
    { char: "'", finger: Finger.RightPinky },
    { char: 'Enter', finger: Finger.RightPinky, width: 2.2, code: 'Enter' },
  ],
  [
    { char: 'Shift', finger: Finger.LeftPinky, width: 2.4, code: 'ShiftLeft' },
    { char: 'z', finger: Finger.LeftPinky },
    { char: 'x', finger: Finger.LeftRing },
    { char: 'c', finger: Finger.LeftMiddle },
    { char: 'v', finger: Finger.LeftIndex },
    { char: 'b', finger: Finger.LeftIndex },
    { char: 'n', finger: Finger.RightIndex },
    { char: 'm', finger: Finger.RightIndex },
    { char: ',', finger: Finger.RightMiddle },
    { char: '.', finger: Finger.RightRing },
    { char: '/', finger: Finger.RightPinky },
    { char: 'Shift', finger: Finger.RightPinky, width: 2.4, code: 'ShiftRight' },
  ],
  [
    { char: 'Space', finger: Finger.Thumb, width: 12, code: 'Space' },
  ]
];

export const FINGER_NAMES_VI: Record<Finger, string> = {
  [Finger.LeftPinky]: 'Ngón Út',
  [Finger.LeftRing]: 'Ngón Áp Út',
  [Finger.LeftMiddle]: 'Ngón Giữa',
  [Finger.LeftIndex]: 'Ngón Trỏ',
  [Finger.Thumb]: 'Ngón Cái',
  [Finger.RightIndex]: 'Ngón Trỏ',
  [Finger.RightMiddle]: 'Ngón Giữa',
  [Finger.RightRing]: 'Ngón Áp Út',
  [Finger.RightPinky]: 'Ngón Út',
};

export const LESSONS: Lesson[] = [
  // --- PHẦN 1: HÀNG CƠ SỞ (HOME ROW) ---
  {
    id: 'basic_home_1',
    groupId: 'hangcoso',
    groupTitle: '1. Hàng Cơ Sở (Home Row)',
    title: 'Bài 1: Tay Trái (A S D F G)',
    description: 'Luyện các ngón tay trái trên hàng phím giữa',
    content: 'a s d f g a s d f g f d s a ag af ad as fa da sa ga',
    difficulty: 'easy',
    category: 'basics'
  },
  {
    id: 'basic_home_2',
    groupId: 'hangcoso',
    groupTitle: '1. Hàng Cơ Sở (Home Row)',
    title: 'Bài 2: Tay Phải (H J K L ;)',
    description: 'Luyện các ngón tay phải trên hàng phím giữa',
    content: 'h j k l ; h j k l ; ; l k j h hl jk lh kh jh',
    difficulty: 'easy',
    category: 'basics'
  },
  {
    id: 'basic_home_3',
    groupId: 'hangcoso',
    groupTitle: '1. Hàng Cơ Sở (Home Row)',
    title: 'Bài 3: Tổng Hợp Hàng Cơ Sở',
    description: 'Kết hợp cả hai tay trên hàng cơ sở',
    content: 'asdf jkl; g h asdfgh jkl; la da ga ha sa fa da la',
    difficulty: 'easy',
    category: 'basics'
  },

  // --- PHẦN 2: HÀNG TRÊN (TOP ROW) ---
  {
    id: 'basic_top_1',
    groupId: 'hangtren',
    groupTitle: '2. Hàng Trên (Top Row)',
    title: 'Bài 1: Tay Trái (Q W E R T)',
    description: 'Vươn ngón tay trái lên hàng phím trên',
    content: 'q w e r t q w e r t te re we qe tr ew wq',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'basic_top_2',
    groupId: 'hangtren',
    groupTitle: '2. Hàng Trên (Top Row)',
    title: 'Bài 2: Tay Phải (Y U I O P)',
    description: 'Vươn ngón tay phải lên hàng phím trên',
    content: 'y u i o p y u i o p yu io op ui uy oy ip',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'basic_top_3',
    groupId: 'hangtren',
    groupTitle: '2. Hàng Trên (Top Row)',
    title: 'Bài 3: Tổng Hợp Hàng Trên',
    description: 'Kết hợp từ đơn giản với hàng trên',
    content: 'ty ei wo qp tieu yeu que qua to te ti tu ta',
    difficulty: 'medium',
    category: 'basics'
  },

  // --- PHẦN 3: HÀNG DƯỚI (BOTTOM ROW) ---
  {
    id: 'basic_bot_1',
    groupId: 'hangduoi',
    groupTitle: '3. Hàng Dưới (Bottom Row)',
    title: 'Bài 1: Tay Trái (Z X C V B)',
    description: 'Gập ngón tay trái xuống hàng phím dưới',
    content: 'z x c v b z x c v b za xa ca va ba vc xz',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'basic_bot_2',
    groupId: 'hangduoi',
    groupTitle: '3. Hàng Dưới (Bottom Row)',
    title: 'Bài 2: Tay Phải (N M , . /)',
    description: 'Gập ngón tay phải xuống hàng phím dưới',
    content: 'n m , . / n m , . / na ma am an mn nm',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'basic_bot_3',
    groupId: 'hangduoi',
    groupTitle: '3. Hàng Dưới (Bottom Row)',
    title: 'Bài 3: Tổng Hợp Các Hàng',
    description: 'Luyện tập các từ ghép đơn giản',
    content: 'con meo nam ngu xem phim ba me em be',
    difficulty: 'medium',
    category: 'basics'
  },

  // --- PHẦN 4: LUYỆN DẤU TIẾNG VIỆT (UPDATED WITH ACCENTS) ---
  {
    id: 'dau1',
    groupId: 'dau',
    groupTitle: '4. Luyện Dấu (Telex)',
    title: 'Dấu Sắc (s) & Huyền (f)',
    description: 'Gõ phím S và F để thêm dấu',
    content: 'ca cá ca cà la lá la là ma má ma mà',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'dau2',
    groupId: 'dau',
    groupTitle: '4. Luyện Dấu (Telex)',
    title: 'Dấu Hỏi (r) & Ngã (x)',
    description: 'Gõ phím R và X',
    content: 'co cỏ co cõ mo mở mo mỡ la lả la lã',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'dau3',
    groupId: 'dau',
    groupTitle: '4. Luyện Dấu (Telex)',
    title: 'Dấu Nặng (j) & Mũ (aa, ee)',
    description: 'Gõ phím J, AA, EE',
    content: 'me mẹ ca cạ a â e ê o ô đ đe đêm',
    difficulty: 'medium',
    category: 'basics'
  },

  // --- PHẦN 5: VĂN BẢN CÓ DẤU ---
  {
    id: 'vb1',
    groupId: 'codau',
    groupTitle: '5. Văn Bản Có Dấu',
    title: 'Ca Dao: Công Cha',
    description: 'Ứng dụng dấu vào câu',
    content: 'công cha như núi thái sơn\nnghĩa mẹ như nước trong nguồn chảy ra',
    difficulty: 'medium',
    category: 'sentences'
  },
  {
    id: 'vb2',
    groupId: 'codau',
    groupTitle: '5. Văn Bản Có Dấu',
    title: 'Thơ: Con Mèo',
    description: 'Luyện tập tổng hợp',
    content: 'con mèo mà trèo cây cau\nhỏi thăm chú chuột đi đâu vắng nhà',
    difficulty: 'hard',
    category: 'sentences'
  },
  {
    id: 'vb3',
    groupId: 'codau',
    groupTitle: '5. Văn Bản Có Dấu',
    title: 'Truyện: Rùa và Thỏ',
    description: 'Đoạn văn dài',
    content: 'ngày xưa có một chú rùa và một chú thỏ\nthỏ chê rùa chậm chạp\nrùa quyết tâm chạy đua với thỏ',
    difficulty: 'hard',
    category: 'sentences'
  },

  // --- PHẦN 6: TRUYỆN NGỤ NGÔN ---
  {
    id: 'nn1',
    groupId: 'ngungon',
    groupTitle: '6. Truyện Ngụ Ngôn',
    title: 'Thầy Bói Xem Voi',
    description: 'Đoạn văn ngắn vui nhộn',
    content: 'năm ông thầy bói mù rủ nhau đi xem voi\nmỗi ông sờ một bộ phận của con voi\nông thì bảo voi như cái quạt\nông thì bảo voi như cái cột đình',
    difficulty: 'medium',
    category: 'sentences'
  },
  {
    id: 'nn2',
    groupId: 'ngungon',
    groupTitle: '6. Truyện Ngụ Ngôn',
    title: 'Ếch Ngồi Đáy Giếng',
    description: 'Bài học về sự khiêm tốn',
    content: 'có một chú ếch sống lâu ngày trong một cái giếng nọ\nxung quanh nó chỉ có vài con nhái cua ốc bé nhỏ\nhằng ngày nó cất tiếng kêu ồm ộp làm vang động cả giếng',
    difficulty: 'medium',
    category: 'sentences'
  },

  // --- PHẦN 7: THƠ THIẾU NHI ---
  {
    id: 'tn1',
    groupId: 'thieunhi',
    groupTitle: '7. Thơ Thiếu Nhi',
    title: 'Hạt Gạo Làng Ta',
    description: 'Thơ Trần Đăng Khoa',
    content: 'hạt gạo làng ta\ncó vị phù sa\ncủa sông kinh thầy\ncó hương sen thơm\ntrong hồ nước đầy',
    difficulty: 'medium',
    category: 'sentences'
  },
  {
    id: 'tn2',
    groupId: 'thieunhi',
    groupTitle: '7. Thơ Thiếu Nhi',
    title: 'Chú Ếch Con',
    description: 'Bài hát quen thuộc',
    content: 'kìa chú là chú ếch con\ncó hai là hai mắt tròn\nchú ngồi học bài một mình\nbên hố bom kề vườn xoan',
    difficulty: 'easy',
    category: 'sentences'
  },
  {
    id: 'tn3',
    groupId: 'thieunhi',
    groupTitle: '7. Thơ Thiếu Nhi',
    title: 'Mèo Con Đi Học',
    description: 'Thơ vui cho bé',
    content: 'hôm nay trời nắng chang chang\nmèo con đi học chẳng mang thứ gì\nchỉ mang một cái bút chì\nvà mang một mẩu bánh mì con con',
    difficulty: 'easy',
    category: 'sentences'
  },

   // --- PHẦN 8: THỬ THÁCH TỐC ĐỘ ---
  {
    id: 'tt1',
    groupId: 'thuthach',
    groupTitle: '8. Thử Thách Tốc Độ',
    title: 'Kiểm tra tốc độ 1',
    description: 'Gõ nhanh và chính xác',
    content: 'trăm năm trong cõi người ta\nchữ tài chữ mệnh khéo là ghét nhau\ntrải qua một cuộc bể dâu\nnhững điều trông thấy mà đau đớn lòng',
    difficulty: 'hard',
    category: 'sentences'
  },
];

export const TELEX_RULES = [
  { key: 's', effect: 'Dấu sắc (á)' },
  { key: 'f', effect: 'Dấu huyền (à)' },
  { key: 'r', effect: 'Dấu hỏi (ả)' },
  { key: 'x', effect: 'Dấu ngã (ã)' },
  { key: 'j', effect: 'Dấu nặng (ạ)' },
  { key: 'aa', effect: 'Â (âm)' },
  { key: 'aw', effect: 'Ă (ăn)' },
  { key: 'ee', effect: 'Ê (êm)' },
  { key: 'oo', effect: 'Ô (ôm)' },
  { key: 'ow', effect: 'Ơ (ơn)' },
  { key: 'dd', effect: 'Đ (đất)' },
  { key: 'uw', effect: 'Ư (ư)' },
];

export const VNI_RULES = [
  { key: '1', effect: 'Dấu sắc (á)' },
  { key: '2', effect: 'Dấu huyền (à)' },
  { key: '3', effect: 'Dấu hỏi (ả)' },
  { key: '4', effect: 'Dấu ngã (ã)' },
  { key: '5', effect: 'Dấu nặng (ạ)' },
  { key: '6', effect: 'Dấu mũ (â, ê, ô)' },
  { key: '7', effect: 'Dấu râu (ơ, ư)' },
  { key: '8', effect: 'Dấu á (ă)' },
  { key: '9', effect: 'Đ (đ)' },
  { key: '0', effect: 'Xóa dấu' },
];

// Tiếng Việt không dấu danh cho trò chơi
export const GAME_WORDS = [
  "con", "meo", "cho", "ga", "vit", "heo", "bo", "trau", "ngua", "de",
  "cam", "tao", "xoai", "mit", "dua", "le", "man", "dao", "chanh",
  "ba", "me", "anh", "chi", "em", "ong", "ba", "co", "di", "chu", "bac",
  "nha", "cua", "ban", "ghe", "den", "sach", "vo", "but", "thuoc", "cap",
  "di", "hoc", "vui", "choi", "an", "ngu", "hat", "mua", "ve", "chay",
  "may", "tinh", "chuot", "phim", "loa", "man", "hinh", "dien", "thoai",
  "mua", "nang", "gio", "may", "sao", "trang", "dat", "nuoc", "lua", "khi"
];
