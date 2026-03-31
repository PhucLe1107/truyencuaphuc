const API_BASE_URL = 'https://otruyenapi.com/v1/api';
const CDN_BASE_URL = 'https://img.otruyenapi.com';

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'API Error');
  }
  return data.data; // The core payload is usually inside data.data
};

/**
 * Get image URL from path
 * Handles both full URLs and relative paths
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /uploads, add CDN domain
  if (imagePath.startsWith('/uploads')) {
    return `${CDN_BASE_URL}${imagePath}`;
  }
  
  // If it's just a filename or relative path, add full uploads path
  return `${CDN_BASE_URL}/uploads/comics/${imagePath}`;
};

/**
 * Process comic data to ensure correct image URLs
 */
const processComicData = (data) => {
  if (!data) return data;
  
  // Handle single comic object with item property (from comic detail API)
  if (data.item) {
    const comic = data.item;
    return {
      ...data,
      item: {
        ...comic,
        thumbnail: getImageUrl(comic.thumb_url),
        thumbnail_original: getImageUrl(comic.thumb_url),
        status: comic.status === 'ongoing' ? 'ongoing' : 
                comic.status === 'coming_soon' ? 'ongoing' : 'completed',
        latestChapter: comic.chapters?.[0]?.server_data?.[0]?.chapter_name || '1',
        views: Math.floor(Math.random() * 100000),
        description: comic.content ? stripHtml(comic.content) : '',
        categories: comic.category || [],
        chapters: processChapters(comic.chapters)
      }
    };
  }
  
  // Handle single comic object with items array
  if (data.items && Array.isArray(data.items)) {
    data.items = data.items.map(comic => ({
      ...comic,
      thumbnail: getImageUrl(comic.thumb_url), // Map thumb_url to thumbnail
      thumbnail_original: getImageUrl(comic.thumb_url),
      status: comic.status === 'ongoing' ? 'ongoing' : 
              comic.status === 'coming_soon' ? 'ongoing' : 'completed',
      latestChapter: comic.chaptersLatest?.[0]?.chapter_name || '1',
      views: Math.floor(Math.random() * 100000) // Mock views since API doesn't provide
    }));
  }
  
  // Handle array of comics
  if (Array.isArray(data)) {
    return data.map(comic => ({
      ...comic,
      thumbnail: getImageUrl(comic.thumb_url),
      thumbnail_original: getImageUrl(comic.thumb_url),
      status: comic.status === 'ongoing' ? 'ongoing' : 
              comic.status === 'coming_soon' ? 'ongoing' : 'completed',
      latestChapter: comic.chaptersLatest?.[0]?.chapter_name || '1',
      views: Math.floor(Math.random() * 100000)
    }));
  }
  
  // Handle single comic
  if (data.thumb_url) {
    data.thumbnail = getImageUrl(data.thumb_url);
    data.thumbnail_original = getImageUrl(data.thumb_url);
  }
  if (data.status) {
    data.status = data.status === 'ongoing' ? 'ongoing' : 
                  data.status === 'coming_soon' ? 'ongoing' : 'completed';
  }
  if (data.chaptersLatest?.[0]?.chapter_name) {
    data.latestChapter = data.chaptersLatest[0].chapter_name;
  }
  if (!data.views) {
    data.views = Math.floor(Math.random() * 100000);
  }
  
  return data;
};

/**
 * Process chapters data from API response
 */
const processChapters = (chapters) => {
  if (!chapters || !Array.isArray(chapters)) return [];
  
  const allChapters = [];
  
  chapters.forEach(server => {
    if (server.server_data && Array.isArray(server.server_data)) {
      server.server_data.forEach(chapter => {
        allChapters.push({
          id: chapter.chapter_name,
          title: `Chapter ${chapter.chapter_name}${chapter.chapter_title ? ': ' + chapter.chapter_title : ''}`,
          filename: chapter.filename,
          apiData: chapter.chapter_api_data,
          serverName: server.server_name,
          views: Math.floor(Math.random() * 10000),
          updatedAt: new Date().toISOString()
        });
      });
    }
  });
  
  // Sort by chapter number (descending for newest first)
  return allChapters.sort((a, b) => {
    const aNum = parseFloat(a.id);
    const bNum = parseFloat(b.id);
    return bNum - aNum;
  });
};

/**
 * Strip HTML tags from string
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Get Home Page comics
 */
export const getHome = async () => {
  const response = await fetch(`${API_BASE_URL}/home`);
  const data = await handleResponse(response);
  return processComicData(data);
};

/**
 * Get Comic List By Status
 * @param {string} type - truyen-moi | sap-ra-mat | dang-phat-hanh | hoan-thanh
 * @param {number} page
 */
export const getListByStatus = async (type = 'truyen-moi', page = 1) => {
  const response = await fetch(`${API_BASE_URL}/danh-sach/${type}?page=${page}`);
  const data = await handleResponse(response);
  return processComicData(data);
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/the-loai`);
  return handleResponse(response);
};

/**
 * Get Comics by Category Slug
 */
export const getComicsByCategory = async (slug, page = 1) => {
  const response = await fetch(`${API_BASE_URL}/the-loai/${slug}?page=${page}`);
  const data = await handleResponse(response);
  return processComicData(data);
};

/**
 * Get Comic Detail
 */
export const getComicDetail = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/truyen-tranh/${slug}`);
  const data = await handleResponse(response);
  return processComicData(data);
};

/**
 * Get Chapter Images
 * @param {string} chapterApiUrl - The API URL for chapter images
 */
export const getChapterImages = async (chapterApiUrl) => {
  try {
    console.log('Fetching chapter images from:', chapterApiUrl)
    const response = await fetch(chapterApiUrl)
    const data = await handleResponse(response)
    console.log('API response data:', data)
    
    // Process chapter images
    if (data.item && data.item.chapter_image && Array.isArray(data.item.chapter_image)) {
      const { domain_cdn, chapter_path } = data.item;
      
      // Handle undefined domain_cdn - use fallback
      const cdnDomain = domain_cdn || 'https://sv1.otruyencdn.com';
      console.log('Domain CDN:', cdnDomain, 'Chapter path:', chapter_path)
      
      const images = data.item.chapter_image.map(image => {
        const imageUrl = `${cdnDomain}/${chapter_path}/${image.image_file}`;
        console.log('Constructed image URL:', imageUrl)
        return {
          ...image,
          src: imageUrl
        };
      });
      
      console.log('Processed images:', images)
      return images;
    }
    
    console.log('No chapter_image found in response')
    return [];
  } catch (error) {
    console.error('Error fetching chapter images:', error)
    return [];
  }
};

/**
 * Search Comics
 */
export const searchComics = async (keyword, page = 1) => {
  const response = await fetch(`${API_BASE_URL}/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  const data = await handleResponse(response);
  return processComicData(data);
};
