function enqueue_booking_widget() {
    // Get the correct path to your theme
    $theme_url = get_stylesheet_directory_uri();
    
    // Enqueue the files with proper dependencies
    wp_enqueue_script('booking-widget', $theme_url . '/assets/booking-widget/index-C5qePBqY.js', array(), '1.0.0', true);
    wp_enqueue_style('booking-widget-styles', $theme_url . '/assets/booking-widget/index-xvpqX3uQ.css', array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'enqueue_booking_widget');

function booking_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '600',
    ), $atts);
    
    return sprintf(
        '<iframe 
            src="https://your-netlify-url.netlify.app" 
            width="100%%" 
            height="%s" 
            frameborder="0" 
            style="border:none;overflow:hidden;" 
            loading="lazy"
            title="Booking Widget"
        ></iframe>',
        esc_attr($atts['height'])
    );
}
add_shortcode('booking_widget', 'booking_widget_shortcode'); 