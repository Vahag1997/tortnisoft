'use client';

import { useState } from 'react';

export default function InstagramPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const res = await fetch(`/api/instagram?username=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.instructions || data.message || 'Failed to fetch');
      }

      const rateLimitError = data.userInfo?.message || data.postsData?.message || data.message;
      if (rateLimitError && (rateLimitError.includes("You are not subscribed") || rateLimitError.includes("exceeded"))) {
         throw new Error(rateLimitError);
      }

      // Handle the new instagram120 JSON schema array
      const userObj = data.userInfo?.result?.[0]?.user || data.userInfo?.data?.user || data.userInfo || data.result?.[0]?.user || data;
      
      let postsArray = [];
      if (data.postsData?.result?.edges) {
          postsArray = data.postsData.result.edges.map(e => e.node ? e.node : e);
      } else if (data.postsData?.posts?.edges) {
          postsArray = data.postsData.posts.edges.map(e => e.node || e);
      } else if (Array.isArray(data.postsData?.posts)) {
          postsArray = data.postsData.posts;
      } else if (Array.isArray(data.postsData?.result)) {
          postsArray = data.postsData.result;
      } else if (data.postsData?.items) {
          postsArray = data.postsData.items;
      }
      
      if (userObj && postsArray.length > 0) {
         userObj.fetched_posts = postsArray;
      }
      
      setProfile(userObj);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract nested counts dynamically based on common IG API responses
  const getCount = (obj, field) => {
    if (!obj) return 0;
    if (typeof obj[field] === 'number') return obj[field]; // some APIs format it cleanly
    if (obj[`edge_${field}`]?.count !== undefined) return obj[`edge_${field}`].count; // raw graphql format
    if (obj[field]?.count !== undefined) return obj[field].count;
    return 0;
  };

  const followers = getCount(profile, 'follower_count') || getCount(profile, 'followed_by') || getCount(profile, 'followers') || 'N/A';
  const following = getCount(profile, 'following_count') || getCount(profile, 'follow') || getCount(profile, 'following') || 'N/A';
  const posts = getCount(profile, 'media_count') || getCount(profile, 'owner_to_timeline_media') || getCount(profile, 'posts') || 'N/A';
  
  // Extract photos
  let photos = [];
  if (profile?.fetched_posts && profile.fetched_posts.length > 0) {
      photos = profile.fetched_posts;
  } else if (profile?.edge_owner_to_timeline_media?.edges) {
    photos = profile.edge_owner_to_timeline_media.edges.map(edge => edge.node);
  } else if (profile?.posts) {
    // Aggressive search for the posts array
    let p = profile.posts;
    if (Array.isArray(p)) {
      // Sometimes it's wrapped in a single element array
      if (p.length === 1 && p[0].items) {
        photos = p[0].items;
      } else if (p.length === 1 && Array.isArray(p[0])) {
        photos = p[0];
      } else {
        photos = p;
      }
    } else if (p.edges) {
      photos = p.edges.map(edge => edge.node || edge);
    } else if (p.items) {
      photos = p.items;
    } else if (p.data) {
      photos = Array.isArray(p.data) ? p.data : (p.data.items || []);
    } else if (p.result) {
      photos = Array.isArray(p.result) ? (p.result[0]?.items || p.result) : [];
    }
  }

  // Ensure it's truly an array
  if (!Array.isArray(photos)) {
      photos = [];
  }

  // Proxy images through our backend to avoid Instagram CORS block
  const proxyImageUrl = (url) => {
    if (!url) return '';
    return `/api/image?url=${encodeURIComponent(url)}`;
  };
  
  const rawAvatarUrl = profile?.hd_profile_pic_url_info?.url || profile?.profile_pic_url_hd || profile?.profile_pic_url;
  const avatarUrl = proxyImageUrl(rawAvatarUrl);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Instagram Profile Search</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter Instagram nickname" 
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}><strong>Error:</strong> {error}</div>}

      {profile && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            )}
            <div>
              <h2 style={{ margin: 0 }}>{profile.full_name || profile.username}</h2>
              <p style={{ color: '#666', margin: '5px 0' }}>@{profile.username}</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>{posts} Posts</span>
                <span style={{ fontWeight: 'bold' }}>{followers} Followers</span>
                <span style={{ fontWeight: 'bold' }}>{following} Following</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{profile.biography}</p>
          </div>

          {!profile.is_private ? (
            <div>
              <h3>Recent Photos</h3>
              {photos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {photos.slice(0, 12).map((photo, i) => {
                    const likeCount = getCount(photo, 'media_preview_like') || getCount(photo, 'likes') || getCount(photo, 'like_count') || 0;
                    const rawImgUrl = photo.display_url || photo.image_url || photo.thumbnail_src || photo.thumbnail_url || photo.image_versions2?.candidates?.[0]?.url;
                    const imgUrl = proxyImageUrl(rawImgUrl);
                    return (
                      <div key={i} style={{ position: 'relative', background: '#f0f0f0', aspectRatio: '1/1' }}>
                        {imgUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <div style={{ position: 'absolute', bottom: 5, left: 5, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                          ❤️ {likeCount}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No photos found or API did not return media nodes.</p>
              )}
            </div>
          ) : (
            <div style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
              <h3>This Account is Private</h3>
              <p>Follow this account to see their photos and videos.</p>
            </div>
          )}

          <details style={{ marginTop: '40px' }}>
            <summary>View Developer Raw JSON (Debug)</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflowX: 'auto', fontSize: '12px' }}>
              {JSON.stringify(profile, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
